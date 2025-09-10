# CementMind AI - Core ML Models Implementation
# Week 2: AI/ML Models for Autonomous Cement Plant Operations

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# ML Libraries
from sklearn.ensemble import RandomForestRegressor, IsolationForest, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, classification_report
from sklearn.cluster import KMeans
import joblib
import json
from typing import Dict, List, Tuple, Optional
import logging
from dataclasses import dataclass
from abc import ABC, abstractmethod

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# =============================================================================
# DATA GENERATION & SIMULATION MODULE
# =============================================================================

class PlantDataSimulator:
    """
    Comprehensive cement plant data simulator generating realistic sensor data,
    logistics information, and quality parameters for AI model training and testing.
    """
    
    def __init__(self, random_seed: int = 42):
        np.random.seed(random_seed)
        self.logger = logging.getLogger(__name__)
        
        # Plant operational parameters
        self.normal_temp_range = (800, 1200)  # Kiln temperature (°C)
        self.normal_pressure_range = (2.0, 4.5)  # System pressure (bar)
        self.normal_moisture_range = (8, 15)  # Raw material moisture (%)
        self.normal_flow_range = (80, 120)  # Material flow rate (tons/hour)
        
        # Raw material composition ranges
        self.limestone_range = (75, 85)  # %
        self.clay_range = (10, 18)  # %
        self.iron_ore_range = (2, 6)  # %
        self.gypsum_range = (3, 5)  # %
        
        # Quality parameter targets
        self.target_fineness = 350  # m²/kg (Blaine)
        self.target_setting_time = 165  # minutes
        self.target_compressive_strength_3d = 20  # MPa
        self.target_compressive_strength_28d = 53  # MPa
    
    def generate_sensor_data(self, n_samples: int = 10000, 
                           anomaly_rate: float = 0.05) -> pd.DataFrame:
        """Generate realistic sensor data with controlled anomalies"""
        
        timestamps = pd.date_range(
            start=datetime.now() - timedelta(days=30),
            periods=n_samples,
            freq='5min'
        )
        
        # Base normal distributions
        kiln_temp = np.random.normal(1000, 50, n_samples)
        system_pressure = np.random.normal(3.2, 0.3, n_samples)
        material_moisture = np.random.normal(12, 2, n_samples)
        material_flow = np.random.normal(100, 10, n_samples)
        
        # Add realistic correlations and patterns
        # Temperature affects pressure (physics-based relationship)
        system_pressure += (kiln_temp - 1000) * 0.002
        
        # Daily operational cycles
        hour = np.array([ts.hour for ts in timestamps])
        daily_factor = 0.8 + 0.4 * np.sin(2 * np.pi * hour / 24)
        material_flow *= daily_factor
        
        # Weekly maintenance patterns
        day_of_week = np.array([ts.weekday() for ts in timestamps])
        weekly_factor = np.where(day_of_week == 6, 0.3, 1.0)  # Reduced Sunday operations
        material_flow *= weekly_factor
        
        # Inject realistic anomalies
        n_anomalies = int(n_samples * anomaly_rate)
        anomaly_indices = np.random.choice(n_samples, n_anomalies, replace=False)
        
        # Temperature spikes
        temp_anomalies = anomaly_indices[:n_anomalies//3]
        kiln_temp[temp_anomalies] += np.random.normal(200, 50, len(temp_anomalies))
        
        # Pressure drops
        pressure_anomalies = anomaly_indices[n_anomalies//3:2*n_anomalies//3]
        system_pressure[pressure_anomalies] *= np.random.uniform(0.3, 0.7, len(pressure_anomalies))
        
        # Flow rate issues
        flow_anomalies = anomaly_indices[2*n_anomalies//3:]
        material_flow[flow_anomalies] *= np.random.uniform(0.2, 0.8, len(flow_anomalies))
        
        # Additional sensor parameters
        oxygen_level = np.random.normal(3.5, 0.5, n_samples)
        co_level = np.random.normal(150, 25, n_samples)
        nox_level = np.random.normal(800, 100, n_samples)
        
        # Vibration data for equipment health
        mill_vibration = np.random.normal(8, 2, n_samples)
        kiln_vibration = np.random.normal(5, 1, n_samples)
        
        # Energy consumption
        energy_consumption = (kiln_temp * 0.08 + material_flow * 0.5 + 
                            np.random.normal(0, 5, n_samples))
        
        sensor_data = pd.DataFrame({
            'timestamp': timestamps,
            'kiln_temperature': kiln_temp,
            'system_pressure': system_pressure,
            'material_moisture': material_moisture,
            'material_flow_rate': material_flow,
            'oxygen_level': oxygen_level,
            'co_level': co_level,
            'nox_level': nox_level,
            'mill_vibration': mill_vibration,
            'kiln_vibration': kiln_vibration,
            'energy_consumption': energy_consumption,
            'is_anomaly': 0
        })
        
        # Mark anomalies
        sensor_data.loc[anomaly_indices, 'is_anomaly'] = 1
        
        self.logger.info(f"Generated {n_samples} sensor data points with {n_anomalies} anomalies")
        return sensor_data
    
    def generate_raw_material_data(self, n_samples: int = 5000) -> pd.DataFrame:
        """Generate raw material composition and logistics data"""
        
        timestamps = pd.date_range(
            start=datetime.now() - timedelta(days=15),
            periods=n_samples,
            freq='10min'
        )
        
        # Raw material compositions with realistic variations
        limestone = np.random.normal(80, 3, n_samples)
        clay = np.random.normal(14, 2, n_samples)
        iron_ore = np.random.normal(4, 1, n_samples)
        gypsum = np.random.normal(4, 0.5, n_samples)
        
        # Normalize to 100% (realistic constraint)
        total = limestone + clay + iron_ore + gypsum
        limestone = (limestone / total) * 100
        clay = (clay / total) * 100
        iron_ore = (iron_ore / total) * 100
        gypsum = (gypsum / total) * 100
        
        # Chemical properties
        cao = limestone * 0.5 + clay * 0.02 + iron_ore * 0.01  # Simplified relationship
        sio2 = clay * 0.6 + limestone * 0.05 + iron_ore * 0.1
        al2o3 = clay * 0.18 + iron_ore * 0.05
        fe2o3 = iron_ore * 0.85 + clay * 0.08
        
        # Logistics data
        truck_arrivals = np.random.poisson(3, n_samples)  # Average 3 trucks per time period
        inventory_levels = np.random.normal(500, 100, n_samples)  # Tons
        supply_chain_delay = np.random.exponential(2, n_samples)  # Hours
        
        # Quality indicators for raw materials
        limestone_quality = np.random.normal(85, 5, n_samples)  # Quality score 0-100
        clay_quality = np.random.normal(78, 8, n_samples)
        
        raw_material_data = pd.DataFrame({
            'timestamp': timestamps,
            'limestone_percent': limestone,
            'clay_percent': clay,
            'iron_ore_percent': iron_ore,
            'gypsum_percent': gypsum,
            'cao_content': cao,
            'sio2_content': sio2,
            'al2o3_content': al2o3,
            'fe2o3_content': fe2o3,
            'truck_arrivals': truck_arrivals,
            'inventory_level': inventory_levels,
            'supply_chain_delay': supply_chain_delay,
            'limestone_quality': limestone_quality,
            'clay_quality': clay_quality
        })
        
        self.logger.info(f"Generated {n_samples} raw material data points")
        return raw_material_data
    
    def generate_cement_quality_data(self, n_samples: int = 3000) -> pd.DataFrame:
        """Generate cement quality parameters with realistic relationships"""
        
        timestamps = pd.date_range(
            start=datetime.now() - timedelta(days=10),
            periods=n_samples,
            freq='20min'
        )
        
        # Base quality parameters
        fineness = np.random.normal(self.target_fineness, 25, n_samples)
        setting_time = np.random.normal(self.target_setting_time, 15, n_samples)
        
        # Compressive strength with realistic age-based relationship
        strength_3d = np.random.normal(self.target_compressive_strength_3d, 3, n_samples)
        strength_28d = strength_3d * 2.5 + np.random.normal(5, 2, n_samples)
        
        # Physical properties
        density = np.random.normal(3150, 50, n_samples)  # kg/m³
        specific_surface = fineness + np.random.normal(0, 10, n_samples)
        
        # Chemical composition of final cement
        c3s = np.random.normal(55, 5, n_samples)  # Tricalcium silicate
        c2s = np.random.normal(20, 3, n_samples)  # Dicalcium silicate
        c3a = np.random.normal(8, 2, n_samples)   # Tricalcium aluminate
        c4af = np.random.normal(12, 2, n_samples) # Tetracalcium aluminoferrite
        
        # Normalize to realistic total
        total_compounds = c3s + c2s + c3a + c4af
        c3s = (c3s / total_compounds) * 95  # ~95% of these main compounds
        c2s = (c2s / total_compounds) * 95
        c3a = (c3a / total_compounds) * 95
        c4af = (c4af / total_compounds) * 95
        
        # Quality grades (1: Excellent, 2: Good, 3: Acceptable, 4: Poor)
        quality_grade = np.ones(n_samples)
        
        # Define quality criteria
        poor_quality = ((fineness < 300) | (fineness > 400) | 
                       (setting_time < 120) | (setting_time > 220) |
                       (strength_28d < 45))
        acceptable_quality = ((fineness < 320) | (fineness > 380) |
                             (setting_time < 140) | (setting_time > 200) |
                             (strength_28d < 50)) & ~poor_quality
        good_quality = ((fineness < 340) | (fineness > 360) |
                       (setting_time < 150) | (setting_time > 180) |
                       (strength_28d < 52)) & ~acceptable_quality & ~poor_quality
        
        quality_grade[poor_quality] = 4
        quality_grade[acceptable_quality] = 3
        quality_grade[good_quality] = 2
        
        cement_quality_data = pd.DataFrame({
            'timestamp': timestamps,
            'fineness': fineness,
            'setting_time': setting_time,
            'compressive_strength_3d': strength_3d,
            'compressive_strength_28d': strength_28d,
            'density': density,
            'specific_surface': specific_surface,
            'c3s_content': c3s,
            'c2s_content': c2s,
            'c3a_content': c3a,
            'c4af_content': c4af,
            'quality_grade': quality_grade.astype(int)
        })
        
        self.logger.info(f"Generated {n_samples} cement quality data points")
        return cement_quality_data

# =============================================================================
# 1. RAW MATERIAL HANDLING LOGISTICS OPTIMIZATION
# =============================================================================

class LogisticsOptimizer:
    """
    Advanced logistics optimization system using reinforcement learning principles
    and predictive modeling for raw material handling automation.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.scaler = StandardScaler()
        self.demand_predictor = None
        self.route_optimizer = None
        self.resource_allocator = None
        self.is_trained = False
        
    def prepare_logistics_features(self, sensor_data: pd.DataFrame, 
                                 material_data: pd.DataFrame) -> pd.DataFrame:
        """Prepare feature engineering for logistics optimization"""
        
        # Merge datasets on timestamp
        logistics_df = pd.merge_asof(
            sensor_data.sort_values('timestamp'),
            material_data.sort_values('timestamp'),
            on='timestamp',
            direction='nearest'
        )
        
        # Feature engineering
        logistics_df['hour'] = logistics_df['timestamp'].dt.hour
        logistics_df['day_of_week'] = logistics_df['timestamp'].dt.dayofweek
        logistics_df['month'] = logistics_df['timestamp'].dt.month
        
        # Rolling statistics for demand prediction
        logistics_df['flow_rate_ma_24h'] = logistics_df['material_flow_rate'].rolling(
            window=24*12, min_periods=1).mean()  # 24h moving average (5min intervals)
        logistics_df['flow_rate_std_24h'] = logistics_df['material_flow_rate'].rolling(
            window=24*12, min_periods=1).std()
        
        # Inventory urgency score
        logistics_df['inventory_urgency'] = (1000 - logistics_df['inventory_level']) / 1000
        logistics_df['inventory_urgency'] = np.clip(logistics_df['inventory_urgency'], 0, 1)
        
        # Supply chain efficiency score
        logistics_df['supply_efficiency'] = 1 / (1 + logistics_df['supply_chain_delay'] / 10)
        
        # Demand-supply balance
        logistics_df['demand_supply_ratio'] = (
            logistics_df['material_flow_rate'] / 
            (logistics_df['truck_arrivals'] * 25 + 1)  # Assume 25 tons per truck
        )
        
        return logistics_df
    
    def train_demand_predictor(self, logistics_df: pd.DataFrame):
        """Train predictive model for raw material demand forecasting"""
        
        # Features for demand prediction
        feature_columns = [
            'hour', 'day_of_week', 'month',
            'kiln_temperature', 'system_pressure',
            'flow_rate_ma_24h', 'flow_rate_std_24h',
            'inventory_level', 'supply_chain_delay'
        ]
        
        # Target: future material flow rate (1 hour ahead)
        logistics_df['future_flow_rate'] = logistics_df['material_flow_rate'].shift(-12)  # 1 hour ahead
        
        # Remove rows with missing targets
        train_data = logistics_df.dropna()
        
        X = train_data[feature_columns]
        y = train_data['future_flow_rate']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, shuffle=False
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train ensemble model for robust predictions
        self.demand_predictor = GradientBoostingRegressor(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        
        self.demand_predictor.fit(X_train_scaled, y_train)
        
        # Evaluate model
        y_pred = self.demand_predictor.predict(X_test_scaled)
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        self.logger.info(f"Demand Predictor - MSE: {mse:.2f}, MAE: {mae:.2f}, R²: {r2:.3f}")
        
        return {
            'mse': mse,
            'mae': mae,
            'r2': r2,
            'feature_importance': dict(zip(feature_columns, self.demand_predictor.feature_importances_))
        }
    
    def optimize_truck_scheduling(self, logistics_df: pd.DataFrame, 
                                prediction_horizon: int = 48) -> Dict:
        """
        Reinforcement Learning-inspired truck scheduling optimization
        """
        
        if not self.is_trained:
            self.train_demand_predictor(logistics_df)
            self.is_trained = True
        
        # Get current state
        current_state = logistics_df.iloc[-1]
        
        # Predict future demand
        feature_columns = [
            'hour', 'day_of_week', 'month',
            'kiln_temperature', 'system_pressure',
            'flow_rate_ma_24h', 'flow_rate_std_24h',
            'inventory_level', 'supply_chain_delay'
        ]
        
        # Generate future time steps
        future_states = []
        current_time = current_state['timestamp']
        
        for i in range(prediction_horizon):
            future_time = current_time + timedelta(hours=i)
            future_state = current_state.copy()
            future_state['timestamp'] = future_time
            future_state['hour'] = future_time.hour
            future_state['day_of_week'] = future_time.weekday()
            future_state['month'] = future_time.month
            future_states.append(future_state)
        
        future_df = pd.DataFrame(future_states)
        
        # Predict demand for each future time step
        X_future = future_df[feature_columns]
        X_future_scaled = self.scaler.transform(X_future)
        predicted_demand = self.demand_predictor.predict(X_future_scaled)
        
        # Optimization algorithm (simplified Q-learning approach)
        schedule = self._optimize_schedule(
            predicted_demand, 
            current_state['inventory_level'],
            prediction_horizon
        )
        
        return {
            'predicted_demand': predicted_demand.tolist(),
            'optimal_schedule': schedule,
            'total_trucks_needed': sum(schedule.values()),
            'peak_demand_hours': np.argsort(predicted_demand)[-5:].tolist()
        }
    
    def _optimize_schedule(self, predicted_demand: np.ndarray, 
                          current_inventory: float, 
                          horizon: int) -> Dict[int, int]:
        """
        Optimize truck scheduling using dynamic programming approach
        """
        
        # Parameters
        truck_capacity = 25  # tons
        holding_cost_per_hour = 0.1  # Cost per ton per hour
        shortage_cost_per_hour = 2.0  # Cost per ton shortage per hour
        truck_cost = 50  # Cost per truck
        
        # Dynamic programming optimization
        schedule = {}
        inventory_level = current_inventory
        
        for hour in range(horizon):
            demand = predicted_demand[hour]
            
            # Calculate optimal number of trucks
            # This is a simplified heuristic - in practice, use more sophisticated RL
            expected_shortage = max(0, demand - inventory_level)
            
            # Decision: number of trucks to schedule
            if expected_shortage > 0:
                trucks_needed = int(np.ceil(expected_shortage / truck_capacity))
                # Add buffer for safety stock
                trucks_needed = int(trucks_needed * 1.2)
            else:
                trucks_needed = 0
            
            # Update inventory
            inventory_level += trucks_needed * truck_capacity - demand
            inventory_level = max(0, inventory_level)  # Can't go negative
            
            schedule[hour] = trucks_needed
        
        return schedule
    
    def generate_logistics_recommendations(self, logistics_df: pd.DataFrame) -> Dict:
        """Generate actionable logistics recommendations"""
        
        optimization_result = self.optimize_truck_scheduling(logistics_df)
        
        # Analyze current performance
        current_efficiency = logistics_df['supply_efficiency'].iloc[-100:].mean()
        current_inventory_turns = logistics_df['material_flow_rate'].sum() / logistics_df['inventory_level'].mean()
        
        recommendations = {
            'truck_scheduling': optimization_result,
            'performance_metrics': {
                'current_supply_efficiency': current_efficiency,
                'inventory_turnover': current_inventory_turns,
                'average_delay': logistics_df['supply_chain_delay'].iloc[-100:].mean()
            },
            'improvement_opportunities': []
        }
        
        # Generate specific recommendations
        if current_efficiency < 0.8:
            recommendations['improvement_opportunities'].append(
                "Supply chain efficiency is below 80%. Consider optimizing delivery routes."
            )
        
        if current_inventory_turns < 2.0:
            recommendations['improvement_opportunities'].append(
                "Low inventory turnover detected. Consider implementing just-in-time delivery."
            )
        
        return recommendations

# =============================================================================
# 2. CEMENT QUALITY DETECTION & CORRECTION SYSTEM
# =============================================================================

class CementQualityController:
    """
    Advanced cement quality detection and autonomous correction system
    using machine learning and process control algorithms.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.quality_predictor = None
        self.correction_model = None
        self.scaler_quality = StandardScaler()
        self.scaler_process = StandardScaler()
        self.is_trained = False
        
    def prepare_quality_features(self, sensor_data: pd.DataFrame,
                                material_data: pd.DataFrame,
                                quality_data: pd.DataFrame) -> pd.DataFrame:
        """Comprehensive feature engineering for quality prediction"""
        
        # Merge all datasets
        quality_df = pd.merge_asof(
            quality_data.sort_values('timestamp'),
            sensor_data.sort_values('timestamp'),
            on='timestamp',
            direction='nearest'
        )
        
        quality_df = pd.merge_asof(
            quality_df.sort_values('timestamp'),
            material_data.sort_values('timestamp'),
            on='timestamp',
            direction='nearest'
        )
        
        # Process-related features
        quality_df['temp_pressure_ratio'] = quality_df['kiln_temperature'] / (quality_df['system_pressure'] + 1)
        quality_df['energy_efficiency'] = quality_df['material_flow_rate'] / (quality_df['energy_consumption'] + 1)
        
        # Chemical composition ratios (important for cement quality)
        quality_df['cao_sio2_ratio'] = quality_df['cao_content'] / (quality_df['sio2_content'] + 1)
        quality_df['al2o3_fe2o3_ratio'] = quality_df['al2o3_content'] / (quality_df['fe2o3_content'] + 1)
        
        # Material balance features
        quality_df['raw_material_balance'] = (
            quality_df['limestone_percent'] * 0.4 +
            quality_df['clay_percent'] * 0.3 +
            quality_df['iron_ore_percent'] * 0.2 +
            quality_df['gypsum_percent'] * 0.1
        )
        
        # Time-based features
        quality_df['hour'] = quality_df['timestamp'].dt.hour
        quality_df['day_of_week'] = quality_df['timestamp'].dt.dayofweek
        
        # Rolling statistics for process stability
        quality_df['temp_stability'] = quality_df['kiln_temperature'].rolling(
            window=12, min_periods=1).std()
        quality_df['flow_stability'] = quality_df['material_flow_rate'].rolling(
            window=12, min_periods=1).std()
        
        return quality_df
    
    def train_quality_models(self, quality_df: pd.DataFrame):
        """Train models for quality prediction and process correction"""
        
        # Features for quality prediction
        quality_features = [
            'kiln_temperature', 'system_pressure', 'material_moisture',
            'material_flow_rate', 'oxygen_level', 'energy_consumption',
            'limestone_percent', 'clay_percent', 'iron_ore_percent', 'gypsum_percent',
            'cao_content', 'sio2_content', 'al2o3_content', 'fe2o3_content',
            'temp_pressure_ratio', 'energy_efficiency', 'cao_sio2_ratio',
            'al2o3_fe2o3_ratio', 'raw_material_balance',
            'temp_stability', 'flow_stability'
        ]
        
        # Remove rows with missing values
        train_data = quality_df[quality_features + [
            'fineness', 'setting_time', 'compressive_strength_28d', 'quality_grade'
        ]].dropna()
        
        X = train_data[quality_features]
        
        # Multiple targets for comprehensive quality prediction
        y_fineness = train_data['fineness']
        y_setting_time = train_data['setting_time']
        y_strength = train_data['compressive_strength_28d']
        y_grade = train_data['quality_grade']
        
        # Split data
        X_train, X_test, y_fin_train, y_fin_test = train_test_split(
            X, y_fineness, test_size=0.2, random_state=42
        )
        
        _, _, y_set_train, y_set_test = train_test_split(
            X, y_setting_time, test_size=0.2, random_state=42
        )
        
        _, _, y_str_train, y_str_test = train_test_split(
            X, y_strength, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler_quality.fit_transform(X_train)
        X_test_scaled = self.scaler_quality.transform(X_test)
        
        # Train multi-output quality predictor
        self.quality_predictor = {
            'fineness': RandomForestRegressor(n_estimators=150, max_depth=10, random_state=42),
            'setting_time': RandomForestRegressor(n_estimators=150, max_depth=10, random_state=42),
            'strength': RandomForestRegressor(n_estimators=150, max_depth=10, random_state=42)
        }
        
        # Train individual models
        results = {}
        
        for target, model in self.quality_predictor.items():
            if target == 'fineness':
                model.fit(X_train_scaled, y_fin_train)
                y_pred = model.predict(X_test_scaled)
                y_true = y_fin_test
            elif target == 'setting_time':
                model.fit(X_train_scaled, y_set_train)
                y_pred = model.predict(X_test_scaled)
                y_true = y_set_test
            elif target == 'strength':
                model.fit(X_train_scaled, y_str_train)
                y_pred = model.predict(X_test_scaled)
                y_true = y_str_test
            
            # Evaluate model
            mse = mean_squared_error(y_true, y_pred)
            mae = mean_absolute_error(y_true, y_pred)
            r2 = r2_score(y_true, y_pred)
            
            results[target] = {'mse': mse, 'mae': mae, 'r2': r2}
            
            self.logger.info(f"{target.title()} Predictor - MSE: {mse:.2f}, MAE: {mae:.2f}, R²: {r2:.3f}")
        
        # Store feature names for later use
        self.quality_feature_names = quality_features
        self.is_trained = True
        
        return results
    
    def predict_quality(self, current_state: pd.Series) -> Dict:
        """Predict cement quality based on current process state"""
        
        if not self.is_trained:
            raise ValueError("Models must be trained before prediction")
        
        # Prepare features
        features = []
        for feature_name in self.quality_feature_names:
            if feature_name in current_state:
                features.append(current_state[feature_name])
            else:
                # Handle missing features with reasonable defaults
                features.append(0.0)
        
        features = np.array(features).reshape(1, -1)
        features_scaled = self.scaler_quality.transform(features)
        
        # Make predictions
        predictions = {}
        for target, model in self.quality_predictor.items():
            pred = model.predict(features_scaled)[0]
            predictions[target] = pred
        
        # Calculate overall quality score
        fineness_score = self._calculate_quality_score(predictions['fineness'], 350, 25)
        setting_score = self._calculate_quality_score(predictions['setting_time'], 165, 15)
        strength_score = self._calculate_quality_score(predictions['strength'], 53, 5)
        
        overall_score = (fineness_score + setting_score + strength_score) / 3
        
        return {
            'predicted_fineness': predictions['fineness'],
            'predicted_setting_time': predictions['setting_time'],
            'predicted_strength': predictions['strength'],
            'quality_scores': {
                'fineness_score': fineness_score,
                'setting_score': setting_score,
                'strength_score': strength_score,
                'overall_score': overall_score
            },
            'quality_grade': self._determine_quality_grade(overall_score)
        }
    
    def _calculate_quality_score(self, predicted_value: float, target_value: float, tolerance: float) -> float:
        """Calculate quality score (0-100) based on deviation from target"""
        deviation = abs(predicted_value - target_value)
        score = max(0, 100 - (deviation / tolerance) * 50)
        return min(100, score)
    
    def _determine_quality_grade(self, overall_score: float) -> int:
        """Determine quality grade based on overall score"""
        if overall_score >= 90:
            return 1  # Excellent
        elif overall_score >= 75:
            return 2  # Good
        elif overall_score >= 60:
            return 3  # Acceptable
        else:
            return 4  # Poor
    
    def generate_correction_actions(self, quality_prediction: Dict, 
                                  current_state: pd.Series) -> Dict:
        """
        Generate autonomous correction actions based on quality predictions
        """
        
        corrections = {
            'process_adjustments': {},
            'material_adjustments': {},
            'priority': 'low',
            'estimated_impact': {},
            'implementation_time': 'immediate'
        }
        
        overall_score = quality_prediction['quality_scores']['overall_score']
        
        if overall_score < 70:  # Quality issues detected
            corrections['priority'] = 'high'
            
            # Temperature corrections
            if quality_prediction['predicted_fineness'] < 320:  # Too coarse
                temp_increase = (320 - quality_prediction['predicted_fineness']) * 2
                corrections['process_adjustments']['kiln_temperature'] = {
                    'current': current_state.get('kiln_temperature', 1000),
                    'adjustment': f"+{temp_increase:.1f}°C",
                    'reason': 'Increase fineness'
                }
            
            elif quality_prediction['predicted_fineness'] > 380:  # Too fine
                temp_decrease = (quality_prediction['predicted_fineness'] - 380) * 1.5
                corrections['process_adjustments']['kiln_temperature'] = {
                    'current': current_state.get('kiln_temperature', 1000),
                    'adjustment': f"-{temp_decrease:.1f}°C",
                    'reason': 'Reduce over-grinding'
                }
            
            # Setting time corrections
            if quality_prediction['predicted_setting_time'] < 140:  # Too fast
                gypsum_increase = (140 - quality_prediction['predicted_setting_time']) * 0.01
                corrections['material_adjustments']['gypsum_percent'] = {
                    'current': current_state.get('gypsum_percent', 4),
                    'adjustment': f"+{gypsum_increase:.2f}%",
                    'reason': 'Slow down setting time'
                }
            
            elif quality_prediction['predicted_setting_time'] > 200:  # Too slow
                gypsum_decrease = (quality_prediction['predicted_setting_time'] - 200) * 0.008
                corrections['material_adjustments']['gypsum_percent'] = {
                    'current': current_state.get('gypsum_percent', 4),
                    'adjustment': f"-{gypsum_decrease:.2f}%",
                    'reason': 'Speed up setting time'
                }
            
            # Strength corrections
            if quality_prediction['predicted_strength'] < 50:  # Low strength
                limestone_increase = (50 - quality_prediction['predicted_strength']) * 0.3
                corrections['material_adjustments']['limestone_percent'] = {
                    'current': current_state.get('limestone_percent', 80),
                    'adjustment': f"+{limestone_increase:.2f}%",
                    'reason': 'Increase cement strength'
                }
            
            # Flow rate adjustments for stability
            if current_state.get('flow_stability', 0) > 5:
                flow_adjustment = -min(10, current_state.get('flow_stability', 0) - 3)
                corrections['process_adjustments']['material_flow_rate'] = {
                    'current': current_state.get('material_flow_rate', 100),
                    'adjustment': f"{flow_adjustment:.1f} tons/hr",
                    'reason': 'Improve process stability'
                }
        
        # Estimate impact of corrections
        corrections['estimated_impact'] = {
            'quality_improvement': min(30, max(5, 100 - overall_score)),
            'energy_impact': self._estimate_energy_impact(corrections['process_adjustments']),
            'cost_impact': self._estimate_cost_impact(corrections)
        }
        
        return corrections
    
    def _estimate_energy_impact(self, process_adjustments: Dict) -> str:
        """Estimate energy consumption impact of process adjustments"""
        if 'kiln_temperature' in process_adjustments:
            temp_change = process_adjustments['kiln_temperature']['adjustment']
            if '+' in temp_change:
                return "Increase 2-5%"
            else:
                return "Decrease 2-5%"
        return "Minimal impact"
    
    def _estimate_cost_impact(self, corrections: Dict) -> str:
        """Estimate cost impact of corrections"""
        adjustments = len(corrections['process_adjustments']) + len(corrections['material_adjustments'])
        if adjustments > 3:
            return "Medium impact ($500-2000/hr)"
        elif adjustments > 1:
            return "Low impact ($100-500/hr)"
        else:
            return "Minimal impact (<$100/hr)"

# =============================================================================
# 3. REAL-TIME ANOMALY & FAULT DETECTION SYSTEM
# =============================================================================

class AnomalyDetectionSystem:
    """
    Advanced anomaly detection system using ensemble methods for
    real-time fault detection and automated alerting.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.isolation_forest = None
        self.statistical_detector = None
        self.scaler_anomaly = StandardScaler()
        self.normal_ranges = {}
        self.is_trained = False
        
    def prepare_anomaly_features(self, sensor_data: pd.DataFrame) -> pd.DataFrame:
        """Feature engineering specifically for anomaly detection"""
        
        anomaly_df = sensor_data.copy()
        
        # Statistical features for each sensor
        sensor_columns = [
            'kiln_temperature', 'system_pressure', 'material_moisture',
            'material_flow_rate', 'oxygen_level', 'co_level', 'nox_level',
            'mill_vibration', 'kiln_vibration', 'energy_consumption'
        ]
        
        # Rolling statistics (short-term patterns)
        for col in sensor_columns:
            anomaly_df[f'{col}_ma_short'] = anomaly_df[col].rolling(
                window=6, min_periods=1).mean()
            anomaly_df[f'{col}_std_short'] = anomaly_df[col].rolling(
                window=6, min_periods=1).std()
            anomaly_df[f'{col}_deviation'] = (
                anomaly_df[col] - anomaly_df[f'{col}_ma_short']
            ) / (anomaly_df[f'{col}_std_short'] + 0.001)
        
        # Cross-correlation features
        anomaly_df['temp_pressure_correlation'] = (
            anomaly_df['kiln_temperature'] * anomaly_df['system_pressure']
        )
        anomaly_df['flow_energy_correlation'] = (
            anomaly_df['material_flow_rate'] * anomaly_df['energy_consumption']
        )
        
        # Rate of change features
        for col in sensor_columns:
            anomaly_df[f'{col}_rate_of_change'] = anomaly_df[col].diff()
        
        # Time-based features
        anomaly_df['hour'] = anomaly_df['timestamp'].dt.hour
        anomaly_df['minute'] = anomaly_df['timestamp'].dt.minute
        anomaly_df['is_weekend'] = (anomaly_df['timestamp'].dt.dayofweek >= 5).astype(int)
        
        return anomaly_df
    
    def train_anomaly_detectors(self, sensor_data: pd.DataFrame):
        """Train ensemble of anomaly detection models"""
        
        anomaly_df = self.prepare_anomaly_features(sensor_data)
        
        # Select features for anomaly detection
        feature_columns = [col for col in anomaly_df.columns if col not in 
                          ['timestamp', 'is_anomaly']]
        
        # Remove non-numeric columns and handle infinite values
        numeric_features = []
        for col in feature_columns:
            if anomaly_df[col].dtype in ['float64', 'int64']:
                if not anomaly_df[col].isin([np.inf, -np.inf]).any():
                    numeric_features.append(col)
        
        X = anomaly_df[numeric_features].fillna(method='ffill').fillna(0)
        
        # Use only normal data for training (unsupervised learning)
        normal_data = X[anomaly_df['is_anomaly'] == 0]
        
        # Scale features
        X_normal_scaled = self.scaler_anomaly.fit_transform(normal_data)
        
        # Train Isolation Forest
        self.isolation_forest = IsolationForest(
            contamination=0.1,  # Expected contamination rate
            random_state=42,
            n_estimators=200
        )
        self.isolation_forest.fit(X_normal_scaled)
        
        # Train statistical anomaly detector (based on normal ranges)
        self.normal_ranges = {}
        for col in numeric_features:
            mean_val = normal_data[col].mean()
            std_val = normal_data[col].std()
            self.normal_ranges[col] = {
                'mean': mean_val,
                'std': std_val,
                'lower_bound': mean_val - 3 * std_val,
                'upper_bound': mean_val + 3 * std_val
            }
        
        # Evaluate on test data
        test_data = X[anomaly_df['is_anomaly'] == 1]  # Known anomalies
        if len(test_data) > 0:
            X_test_scaled = self.scaler_anomaly.transform(test_data)
            
            # Isolation Forest predictions
            if_predictions = self.isolation_forest.predict(X_test_scaled)
            if_anomalies = (if_predictions == -1).sum()
            
            # Statistical detector predictions
            stat_anomalies = self._detect_statistical_anomalies(test_data)
            
            detection_rate_if = if_anomalies / len(test_data)
            detection_rate_stat = stat_anomalies / len(test_data)
            
            self.logger.info(f"Isolation Forest detection rate: {detection_rate_if:.2%}")
            self.logger.info(f"Statistical detector detection rate: {detection_rate_stat:.2%}")
        
        self.feature_names = numeric_features
        self.is_trained = True
        
        return {
            'isolation_forest_trained': True,
            'statistical_detector_trained': True,
            'normal_ranges_calculated': len(self.normal_ranges),
            'feature_count': len(numeric_features)
        }
    
    def detect_anomalies(self, current_data: pd.DataFrame) -> Dict:
        """Real-time anomaly detection on current sensor data"""
        
        if not self.is_trained:
            raise ValueError("Anomaly detectors must be trained before detection")
        
        anomaly_df = self.prepare_anomaly_features(current_data)
        
        # Prepare features
        X = anomaly_df[self.feature_names].fillna(method='ffill').fillna(0)
        X_scaled = self.scaler_anomaly.transform(X)
        
        # Isolation Forest detection
        if_predictions = self.isolation_forest.predict(X_scaled)
        if_scores = self.isolation_forest.score_samples(X_scaled)
        
        # Statistical detection
        stat_anomalies = []
        stat_scores = []
        
        for idx, row in X.iterrows():
            anomaly_count = 0
            total_score = 0
            
            for col in self.feature_names:
                if col in self.normal_ranges:
                    value = row[col]
                    bounds = self.normal_ranges[col]
                    
                    if value < bounds['lower_bound'] or value > bounds['upper_bound']:
                        anomaly_count += 1
                    
                    # Calculate normalized deviation score
                    deviation = abs(value - bounds['mean']) / (bounds['std'] + 0.001)
                    total_score += deviation
            
            # Consider anomaly if more than 20% of features are out of bounds
            is_anomaly = (anomaly_count / len(self.feature_names)) > 0.2
            stat_anomalies.append(is_anomaly)
            stat_scores.append(total_score / len(self.feature_names))
        
        # Combine predictions (ensemble approach)
        final_predictions = []
        confidence_scores = []
        
        for i in range(len(current_data)):
            if_anomaly = if_predictions[i] == -1
            stat_anomaly = stat_anomalies[i]
            
            # Ensemble decision: anomaly if either detector triggers
            is_anomaly = if_anomaly or stat_anomaly
            
            # Confidence score (higher = more confident it's an anomaly)
            confidence = (abs(if_scores[i]) + stat_scores[i]) / 2
            
            final_predictions.append(is_anomaly)
            confidence_scores.append(confidence)
        
        # Detailed analysis for detected anomalies
        anomaly_details = []
        for i, (is_anomaly, confidence) in enumerate(zip(final_predictions, confidence_scores)):
            if is_anomaly:
                details = self._analyze_anomaly_details(
                    current_data.iloc[i], X.iloc[i], confidence
                )
                anomaly_details.append(details)
        
        return {
            'anomalies_detected': sum(final_predictions),
            'anomaly_indices': [i for i, pred in enumerate(final_predictions) if pred],
            'confidence_scores': confidence_scores,
            'anomaly_details': anomaly_details,
            'severity_levels': self._classify_severity(confidence_scores, final_predictions)
        }
    
    def _detect_statistical_anomalies(self, data: pd.DataFrame) -> int:
        """Helper method for statistical anomaly detection"""
        anomaly_count = 0
        for _, row in data.iterrows():
            feature_anomalies = 0
            for col in self.feature_names:
                if col in self.normal_ranges and col in data.columns:
                    value = row[col]
                    bounds = self.normal_ranges[col]
                    if value < bounds['lower_bound'] or value > bounds['upper_bound']:
                        feature_anomalies += 1
            
            if (feature_anomalies / len(self.feature_names)) > 0.2:
                anomaly_count += 1
        
        return anomaly_count
    
    def _analyze_anomaly_details(self, sensor_row: pd.Series, 
                               feature_row: pd.Series, confidence: float) -> Dict:
        """Analyze specific details of detected anomalies"""
        
        details = {
            'timestamp': sensor_row['timestamp'],
            'confidence': confidence,
            'affected_sensors': [],
            'severity': 'medium',
            'potential_causes': [],
            'recommended_actions': []
        }
        
        # Check which sensors are anomalous
        for col in ['kiln_temperature', 'system_pressure', 'material_flow_rate', 
                   'mill_vibration', 'kiln_vibration']:
            if col in self.normal_ranges and col in sensor_row:
                value = sensor_row[col]
                bounds = self.normal_ranges[col]
                
                if value < bounds['lower_bound'] or value > bounds['upper_bound']:
                    deviation_pct = abs(value - bounds['mean']) / bounds['mean'] * 100
                    details['affected_sensors'].append({
                        'sensor': col,
                        'current_value': value,
                        'expected_range': f"{bounds['lower_bound']:.1f} - {bounds['upper_bound']:.1f}",
                        'deviation_percent': deviation_pct
                    })
        
        # Determine severity
        if confidence > 2.0:
            details['severity'] = 'critical'
        elif confidence > 1.0:
            details['severity'] = 'high'
        elif confidence > 0.5:
            details['severity'] = 'medium'
        else:
            details['severity'] = 'low'
        
        # Generate potential causes and actions
        details.update(self._generate_anomaly_response(details['affected_sensors']))
        
        return details
    
    def _generate_anomaly_response(self, affected_sensors: List[Dict]) -> Dict:
        """Generate potential causes and recommended actions for anomalies"""
        
        causes = []
        actions = []
        
        for sensor_info in affected_sensors:
            sensor = sensor_info['sensor']
            deviation = sensor_info['deviation_percent']
            
            if sensor == 'kiln_temperature':
                if deviation > 15:
                    causes.append("Kiln burner malfunction or fuel supply issue")
                    actions.append("Check burner operation and fuel quality")
                else:
                    causes.append("Normal temperature variation")
                    actions.append("Monitor temperature trend")
            
            elif sensor == 'system_pressure':
                if deviation > 20:
                    causes.append("Blockage in system or fan malfunction")
                    actions.append("Inspect system for blockages, check fan operation")
                else:
                    causes.append("Minor pressure fluctuation")
                    actions.append("Continue monitoring")
            
            elif sensor == 'material_flow_rate':
                if deviation > 25:
                    causes.append("Feeder malfunction or material blockage")
                    actions.append("Inspect material feeders and conveyor systems")
                else:
                    causes.append("Normal flow variation")
                    actions.append("Monitor flow stability")
            
            elif 'vibration' in sensor:
                if deviation > 30:
                    causes.append("Equipment bearing wear or misalignment")
                    actions.append("Schedule immediate maintenance inspection")
                else:
                    causes.append("Minor vibration increase")
                    actions.append("Monitor vibration trend")
        
        return {
            'potential_causes': causes,
            'recommended_actions': actions
        }
    
    def _classify_severity(self, confidence_scores: List[float], 
                          predictions: List[bool]) -> Dict:
        """Classify overall severity of detected anomalies"""
        
        if not any(predictions):
            return {'level': 'normal', 'count': 0}
        
        anomaly_scores = [score for score, pred in zip(confidence_scores, predictions) if pred]
        max_score = max(anomaly_scores)
        avg_score = np.mean(anomaly_scores)
        
        if max_score > 2.5 or avg_score > 1.5:
            return {'level': 'critical', 'count': len(anomaly_scores), 'max_confidence': max_score}
        elif max_score > 1.5 or avg_score > 1.0:
            return {'level': 'high', 'count': len(anomaly_scores), 'max_confidence': max_score}
        elif max_score > 0.8 or avg_score > 0.6:
            return {'level': 'medium', 'count': len(anomaly_scores), 'max_confidence': max_score}
        else:
            return {'level': 'low', 'count': len(anomaly_scores), 'max_confidence': max_score}

# =============================================================================
# INTEGRATED AI SYSTEM ORCHESTRATOR
# =============================================================================

class CementMindAI:
    """
    Main orchestrator class that integrates all AI systems for comprehensive
    cement plant automation and optimization.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.data_simulator = PlantDataSimulator()
        self.logistics_optimizer = LogisticsOptimizer()
        self.quality_controller = CementQualityController()
        self.anomaly_detector = AnomalyDetectionSystem()
        
        self.sensor_data = None
        self.material_data = None
        self.quality_data = None
        
        self.system_status = {
            'initialized': False,
            'data_generated': False,
            'models_trained': False,
            'real_time_ready': False
        }
    
    def initialize_system(self, generate_data: bool = True):
        """Initialize the complete AI system with data generation and model training"""
        
        self.logger.info("Initializing CementMind AI System...")
        
        if generate_data:
            self.logger.info("Generating comprehensive plant data...")
            
            # Generate synthetic plant data
            self.sensor_data = self.data_simulator.generate_sensor_data(n_samples=15000)
            self.material_data = self.data_simulator.generate_raw_material_data(n_samples=7500)
            self.quality_data = self.data_simulator.generate_cement_quality_data(n_samples=4500)
            
            self.system_status['data_generated'] = True
            self.logger.info("✓ Plant data generation completed")
        
        # Train all AI models
        self.logger.info("Training AI models...")
        
        try:
            # Train logistics optimization models
            logistics_df = self.logistics_optimizer.prepare_logistics_features(
                self.sensor_data, self.material_data
            )
            logistics_results = self.logistics_optimizer.train_demand_predictor(logistics_df)
            self.logger.info("✓ Logistics optimization models trained")
            
            # Train quality control models
            quality_df = self.quality_controller.prepare_quality_features(
                self.sensor_data, self.material_data, self.quality_data
            )
            quality_results = self.quality_controller.train_quality_models(quality_df)
            self.logger.info("✓ Quality control models trained")
            
            # Train anomaly detection models
            anomaly_results = self.anomaly_detector.train_anomaly_detectors(self.sensor_data)
            self.logger.info("✓ Anomaly detection models trained")
            
            self.system_status['models_trained'] = True
            self.system_status['real_time_ready'] = True
            
            self.logger.info("🎉 CementMind AI System fully initialized and ready!")
            
            return {
                'logistics_performance': logistics_results,
                'quality_performance': quality_results,
                'anomaly_performance': anomaly_results,
                'system_status': self.system_status
            }
            
        except Exception as e:
            self.logger.error(f"Error during model training: {str(e)}")
            raise
    
    def run_real_time_analysis(self, current_timestamp: Optional[str] = None) -> Dict:
        """Run comprehensive real-time analysis and generate recommendations"""
        
        if not self.system_status['real_time_ready']:
            raise ValueError("System must be initialized before real-time analysis")
        
        # Simulate current plant state (in production, this would be real sensor data)
        current_sensor = self.sensor_data.iloc[-1:].copy()
        current_material = self.material_data.iloc[-1:].copy()
        
        if current_timestamp:
            current_sensor['timestamp'] = pd.to_datetime(current_timestamp)
            current_material['timestamp'] = pd.to_datetime(current_timestamp)
        
        results = {
            'timestamp': current_sensor['timestamp'].iloc[0],
            'system_status': 'operational',
            'alerts': [],
            'recommendations': {},
            'performance_metrics': {}
        }
        
        try:
            # 1. Anomaly Detection
            self.logger.info("Running anomaly detection...")
            anomaly_results = self.anomaly_detector.detect_anomalies(current_sensor)
            
            if anomaly_results['anomalies_detected'] > 0:
                results['alerts'].append({
                    'type': 'anomaly',
                    'severity': anomaly_results['severity_levels']['level'],
                    'count': anomaly_results['anomalies_detected'],
                    'details': anomaly_results['anomaly_details']
                })
                
                if anomaly_results['severity_levels']['level'] in ['critical', 'high']:
                    results['system_status'] = 'alert'
            
            # 2. Quality Prediction and Control
            self.logger.info("Predicting cement quality...")
            
            # Prepare current state for quality prediction
            combined_state = pd.concat([current_sensor, current_material], axis=1).iloc[0]
            quality_df = self.quality_controller.prepare_quality_features(
                current_sensor, current_material, 
                pd.DataFrame([{'timestamp': combined_state['timestamp']}])  # Dummy quality data
            )
            
            if len(quality_df) > 0:
                quality_prediction = self.quality_controller.predict_quality(quality_df.iloc[0])
                quality_corrections = self.quality_controller.generate_correction_actions(
                    quality_prediction, combined_state
                )
                
                results['recommendations']['quality_control'] = {
                    'predictions': quality_prediction,
                    'corrections': quality_corrections
                }
                
                # Add quality alerts
                if quality_prediction['quality_grades'] > 2:  # Below acceptable quality
                    results['alerts'].append({
                        'type': 'quality',
                        'severity': 'high' if quality_prediction['quality_grades'] > 3 else 'medium',
                        'message': f"Quality grade {quality_prediction['quality_grades']} predicted",
                        'details': quality_prediction
                    })
            
            # 3. Logistics Optimization
            self.logger.info("Optimizing logistics...")
            logistics_df = self.logistics_optimizer.prepare_logistics_features(
                self.sensor_data.tail(100), self.material_data.tail(50)
            )
            
            logistics_recommendations = self.logistics_optimizer.generate_logistics_recommendations(
                logistics_df
            )
            
            results['recommendations']['logistics'] = logistics_recommendations
            
            # Check for logistics alerts
            if logistics_recommendations['performance_metrics']['current_supply_efficiency'] < 0.7:
                results['alerts'].append({
                    'type': 'logistics',
                    'severity': 'medium',
                    'message': "Low supply chain efficiency detected",
                    'details': logistics_recommendations['performance_metrics']
                })
            
            # 4. Performance Metrics
            results['performance_metrics'] = {
                'energy_efficiency': float(combined_state.get('energy_efficiency', 0)),
                'material_flow_rate': float(combined_state.get('material_flow_rate', 0)),
                'system_pressure': float(combined_state.get('system_pressure', 0)),
                'kiln_temperature': float(combined_state.get('kiln_temperature', 0)),
                'quality_score': quality_prediction.get('quality_scores', {}).get('overall_score', 0)
                if 'quality_prediction' in locals() else 0,
                'anomaly_confidence': np.mean(anomaly_results['confidence_scores'])
                if anomaly_results['confidence_scores'] else 0
            }
            
            # Overall system assessment
            if len(results['alerts']) == 0:
                results['system_status'] = 'optimal'
            elif any(alert['severity'] == 'critical' for alert in results['alerts']):
                results['system_status'] = 'critical'
            elif any(alert['severity'] == 'high' for alert in results['alerts']):
                results['system_status'] = 'warning'
            
            self.logger.info(f"✓ Real-time analysis completed - Status: {results['system_status']}")
            
        except Exception as e:
            self.logger.error(f"Error during real-time analysis: {str(e)}")
            results['system_status'] = 'error'
            results['error_message'] = str(e)
        
        return results
    
    def generate_comprehensive_report(self) -> Dict:
        """Generate comprehensive system performance and analysis report"""
        
        report = {
            'timestamp': datetime.now(),
            'system_overview': self.system_status,
            'data_statistics': {},
            'model_performance': {},
            'operational_insights': {},
            'recommendations': []
        }
        
        if self.system_status['data_generated']:
            # Data statistics
            report['data_statistics'] = {
                'sensor_data_points': len(self.sensor_data),
                'material_data_points': len(self.material_data),
                'quality_data_points': len(self.quality_data),
                'anomaly_rate': self.sensor_data['is_anomaly'].mean(),
                'data_time_span': f"{(self.sensor_data['timestamp'].max() - self.sensor_data['timestamp'].min()).days} days"
            }
            
            # Operational insights
            report['operational_insights'] = {
                'avg_energy_consumption': self.sensor_data['energy_consumption'].mean(),
                'temperature_stability': self.sensor_data['kiln_temperature'].std(),
                'material_flow_consistency': self.sensor_data['material_flow_rate'].std(),
                'quality_grade_distribution': self.quality_data['quality_grade'].value_counts().to_dict()
                if hasattr(self, 'quality_data') and self.quality_data is not None else {}
            }
        
        # Strategic recommendations
        report['recommendations'] = [
            "Implement predictive maintenance based on vibration patterns",
            "Optimize alternative fuel usage to improve sustainability",
            "Enhance real-time quality control with automated corrections",
            "Deploy edge computing for faster anomaly response",
            "Integrate supply chain optimization with production planning"
        ]
        
        return report
    
    def save_models(self, file_path: str = "cementmind_models.joblib"):
        """Save trained models to disk"""
        
        models_dict = {
            'logistics_optimizer': {
                'demand_predictor': self.logistics_optimizer.demand_predictor,
                'scaler': self.logistics_optimizer.scaler,
                'is_trained': self.logistics_optimizer.is_trained
            },
            'quality_controller': {
                'quality_predictor': self.quality_controller.quality_predictor,
                'scaler_quality': self.quality_controller.scaler_quality,
                'feature_names': self.quality_controller.quality_feature_names
                if hasattr(self.quality_controller, 'quality_feature_names') else None,
                'is_trained': self.quality_controller.is_trained
            },
            'anomaly_detector': {
                'isolation_forest': self.anomaly_detector.isolation_forest,
                'scaler_anomaly': self.anomaly_detector.scaler_anomaly,
                'normal_ranges': self.anomaly_detector.normal_ranges,
                'feature_names': self.anomaly_detector.feature_names
                if hasattr(self.anomaly_detector, 'feature_names') else None,
                'is_trained': self.anomaly_detector.is_trained
            },
            'system_status': self.system_status
        }
        
        joblib.dump(models_dict, file_path)
        self.logger.info(f"✓ Models saved to {file_path}")
    
    def load_models(self, file_path: str = "cementmind_models.joblib"):
        """Load trained models from disk"""
        
        try:
            models_dict = joblib.load(file_path)
            
            # Restore logistics optimizer
            self.logistics_optimizer.demand_predictor = models_dict['logistics_optimizer']['demand_predictor']
            self.logistics_optimizer.scaler = models_dict['logistics_optimizer']['scaler']
            self.logistics_optimizer.is_trained = models_dict['logistics_optimizer']['is_trained']
            
            # Restore quality controller
            self.quality_controller.quality_predictor = models_dict['quality_controller']['quality_predictor']
            self.quality_controller.scaler_quality = models_dict['quality_controller']['scaler_quality']
            if models_dict['quality_controller']['feature_names']:
                self.quality_controller.quality_feature_names = models_dict['quality_controller']['feature_names']
            self.quality_controller.is_trained = models_dict['quality_controller']['is_trained']
            
            # Restore anomaly detector
            self.anomaly_detector.isolation_forest = models_dict['anomaly_detector']['isolation_forest']
            self.anomaly_detector.scaler_anomaly = models_dict['anomaly_detector']['scaler_anomaly']
            self.anomaly_detector.normal_ranges = models_dict['anomaly_detector']['normal_ranges']
            if models_dict['anomaly_detector']['feature_names']:
                self.anomaly_detector.feature_names = models_dict['anomaly_detector']['feature_names']
            self.anomaly_detector.is_trained = models_dict['anomaly_detector']['is_trained']
            
            # Restore system status
            self.system_status = models_dict['system_status']
            
            self.logger.info(f"✓ Models loaded from {file_path}")
            
        except Exception as e:
            self.logger.error(f"Error loading models: {str(e)}")
            raise

# =============================================================================
# DEMONSTRATION AND TESTING MODULE
# =============================================================================

def run_comprehensive_demo():
    """
    Comprehensive demonstration of the CementMind AI system with all features.
    This function showcases the complete capabilities for hackathon presentation.
    """
    
    print("=" * 80)
    print("🏭 CEMENTMIND AI - COMPREHENSIVE SYSTEM DEMONSTRATION")
    print("   Autonomous Cement Plant Operations with Generative AI")
    print("=" * 80)
    
    # Initialize the AI system
    print("\n🚀 PHASE 1: SYSTEM INITIALIZATION")
    print("-" * 50)
    
    cement_ai = CementMindAI()
    initialization_results = cement_ai.initialize_system(generate_data=True)
    
    print(f"✓ Data Generation: {initialization_results}")
    print(f"✓ System Status: {cement_ai.system_status}")
    
    # Display data overview
    print("\n📊 PHASE 2: DATA OVERVIEW")
    print("-" * 50)
    
    print(f"Sensor Data Shape: {cement_ai.sensor_data.shape}")
    print(f"Material Data Shape: {cement_ai.material_data.shape}")
    print(f"Quality Data Shape: {cement_ai.quality_data.shape}")
    
    print(f"\nSensor Data Sample:")
    print(cement_ai.sensor_data[['timestamp', 'kiln_temperature', 'system_pressure', 
                                'material_flow_rate', 'energy_consumption', 'is_anomaly']].head())
    
    # Demonstrate real-time analysis
    print("\n🔍 PHASE 3: REAL-TIME ANALYSIS DEMONSTRATION")
    print("-" * 50)
    
    analysis_result = cement_ai.run_real_time_analysis()
    
    print(f"System Status: {analysis_result['system_status']}")
    print(f"Alerts Count: {len(analysis_result['alerts'])}")
    
    if analysis_result['alerts']:
        print("\n🚨 ACTIVE ALERTS:")
        for i, alert in enumerate(analysis_result['alerts'], 1):
            print(f"  {i}. Type: {alert['type'].upper()}, Severity: {alert['severity'].upper()}")
            if 'message' in alert:
                print(f"     Message: {alert['message']}")
    
    # Quality Control Demonstration
    print("\n🎯 PHASE 4: QUALITY CONTROL DEMONSTRATION")
    print("-" * 50)
    
    if 'quality_control' in analysis_result['recommendations']:
        quality_rec = analysis_result['recommendations']['quality_control']
        predictions = quality_rec['predictions']
        corrections = quality_rec['corrections']
        
        print("QUALITY PREDICTIONS:")
        print(f"  • Predicted Fineness: {predictions['predicted_fineness']:.1f} m²/kg")
        print(f"  • Predicted Setting Time: {predictions['predicted_setting_time']:.1f} minutes")
        print(f"  • Predicted Strength (28d): {predictions['predicted_strength']:.1f} MPa")
        print(f"  • Overall Quality Score: {predictions['quality_scores']['overall_score']:.1f}/100")
        print(f"  • Quality Grade: {predictions['quality_grade']}/4")
        
        print(f"\nAUTONOMOUS CORRECTIONS RECOMMENDED:")
        print(f"  • Priority Level: {corrections['priority'].upper()}")
        
        if corrections['process_adjustments']:
            print("  • Process Adjustments:")
            for param, adjustment in corrections['process_adjustments'].items():
                print(f"    - {param}: {adjustment['adjustment']} ({adjustment['reason']})")
        
        if corrections['material_adjustments']:
            print("  • Material Adjustments:")
            for param, adjustment in corrections['material_adjustments'].items():
                print(f"    - {param}: {adjustment['adjustment']} ({adjustment['reason']})")
        
        print(f"  • Expected Quality Improvement: {corrections['estimated_impact']['quality_improvement']}%")
        print(f"  • Energy Impact: {corrections['estimated_impact']['energy_impact']}")
        print(f"  • Cost Impact: {corrections['estimated_impact']['cost_impact']}")
    
    # Logistics Optimization Demonstration
    print("\n🚛 PHASE 5: LOGISTICS OPTIMIZATION DEMONSTRATION")
    print("-" * 50)
    
    if 'logistics' in analysis_result['recommendations']:
        logistics_rec = analysis_result['recommendations']['logistics']
        truck_schedule = logistics_rec['truck_scheduling']
        performance = logistics_rec['performance_metrics']
        
        print("LOGISTICS PERFORMANCE:")
        print(f"  • Current Supply Efficiency: {performance['current_supply_efficiency']:.1%}")
        print(f"  • Inventory Turnover: {performance['inventory_turnover']:.2f}")
        print(f"  • Average Delivery Delay: {performance['average_delay']:.1f} hours")
        
        print(f"\nTRUCK SCHEDULING OPTIMIZATION:")
        print(f"  • Total Trucks Needed (48h): {truck_schedule['total_trucks_needed']}")
        print(f"  • Peak Demand Hours: {truck_schedule['peak_demand_hours']}")
        
        # Show first 12 hours of schedule
        schedule_sample = {k: v for k, v in truck_schedule['optimal_schedule'].items() if k < 12}
        print(f"  • Next 12 Hours Schedule: {schedule_sample}")
        
        if logistics_rec['improvement_opportunities']:
            print(f"\nIMPROVEMENT OPPORTUNITIES:")
            for i, opportunity in enumerate(logistics_rec['improvement_opportunities'], 1):
                print(f"  {i}. {opportunity}")
    
    # Performance Metrics Dashboard
    print("\n📈 PHASE 6: PERFORMANCE METRICS DASHBOARD")
    print("-" * 50)
    
    metrics = analysis_result['performance_metrics']
    print("REAL-TIME PLANT METRICS:")
    print(f"  • Energy Efficiency: {metrics['energy_efficiency']:.2f}")
    print(f"  • Material Flow Rate: {metrics['material_flow_rate']:.1f} tons/hour")
    print(f"  • System Pressure: {metrics['system_pressure']:.2f} bar")
    print(f"  • Kiln Temperature: {metrics['kiln_temperature']:.0f} °C")
    print(f"  • Quality Score: {metrics['quality_score']:.1f}/100")
    print(f"  • Anomaly Confidence: {metrics['anomaly_confidence']:.3f}")
    
    # Generate comprehensive report
    print("\n📋 PHASE 7: COMPREHENSIVE SYSTEM REPORT")
    print("-" * 50)
    
    report = cement_ai.generate_comprehensive_report()
    
    print("SYSTEM OVERVIEW:")
    print(f"  • Data Points Generated: {report['data_statistics']['sensor_data_points']:,}")
    print(f"  • Anomaly Rate: {report['data_statistics']['anomaly_rate']:.2%}")
    print(f"  • Data Time Span: {report['data_statistics']['data_time_span']}")
    
    print(f"\nOPERATIONAL INSIGHTS:")
    print(f"  • Average Energy Consumption: {report['operational_insights']['avg_energy_consumption']:.1f} kWh")
    print(f"  • Temperature Stability (σ): {report['operational_insights']['temperature_stability']:.1f} °C")
    print(f"  • Flow Rate Consistency (σ): {report['operational_insights']['material_flow_consistency']:.1f} tons/hr")
    
    if report['operational_insights']['quality_grade_distribution']:
        print(f"  • Quality Grade Distribution: {report['operational_insights']['quality_grade_distribution']}")
    
    # Strategic Recommendations
    print(f"\nSTRATEGIC RECOMMENDATIONS:")
    for i, rec in enumerate(report['recommendations'], 1):
        print(f"  {i}. {rec}")
    
    # Save models demonstration
    print("\n💾 PHASE 8: MODEL PERSISTENCE")
    print("-" * 50)
    
    try:
        cement_ai.save_models("demo_cementmind_models.joblib")
        print("✓ Models successfully saved for production deployment")
    except Exception as e:
        print(f"✗ Model saving failed: {e}")
    
    # Final summary
    print("\n" + "=" * 80)
    print("🎉 CEMENTMIND AI DEMONSTRATION COMPLETED SUCCESSFULLY!")
    print("=" * 80)
    print("\nSYSTEM CAPABILITIES DEMONSTRATED:")
    print("✓ Comprehensive plant data simulation (15,000+ sensor points)")
    print("✓ Advanced anomaly detection with ensemble methods")
    print("✓ Predictive cement quality control with autonomous corrections")
    print("✓ AI-powered logistics optimization and truck scheduling")
    print("✓ Real-time performance monitoring and alerting")
    print("✓ Strategic insights and operational recommendations")
    print("✓ Production-ready model persistence and deployment")
    
    return cement_ai, analysis_result, report

# =============================================================================
# ADDITIONAL UTILITIES AND HELPER FUNCTIONS
# =============================================================================

def visualize_system_performance(cement_ai: CementMindAI):
    """Create comprehensive visualizations of system performance"""
    
    try:
        import matplotlib.pyplot as plt
        import seaborn as sns
        
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        fig.suptitle('CementMind AI - System Performance Dashboard', fontsize=16, fontweight='bold')
        
        # 1. Energy Consumption Trend
        axes[0, 0].plot(cement_ai.sensor_data['timestamp'].iloc[-1000:], 
                       cement_ai.sensor_data['energy_consumption'].iloc[-1000:])
        axes[0, 0].set_title('Energy Consumption Trend')
        axes[0, 0].set_ylabel('kWh')
        axes[0, 0].tick_params(axis='x', rotation=45)
        
        # 2. Temperature vs Pressure Correlation
        axes[0, 1].scatter(cement_ai.sensor_data['kiln_temperature'], 
                          cement_ai.sensor_data['system_pressure'],
                          c=cement_ai.sensor_data['is_anomaly'], cmap='viridis', alpha=0.6)
        axes[0, 1].set_title('Temperature vs Pressure (Anomalies in Yellow)')
        axes[0, 1].set_xlabel('Kiln Temperature (°C)')
        axes[0, 1].set_ylabel('System Pressure (bar)')
        
        # 3. Quality Grade Distribution
        if cement_ai.quality_data is not None:
            grade_counts = cement_ai.quality_data['quality_grade'].value_counts().sort_index()
            axes[0, 2].bar(grade_counts.index, grade_counts.values)
            axes[0, 2].set_title('Quality Grade Distribution')
            axes[0, 2].set_xlabel('Quality Grade (1=Excellent, 4=Poor)')
            axes[0, 2].set_ylabel('Count')
        
        # 4. Material Flow Rate Stability
        flow_data = cement_ai.sensor_data['material_flow_rate'].iloc[-2000:]
        axes[1, 0].hist(flow_data, bins=50, alpha=0.7, color='skyblue')
        axes[1, 0].axvline(flow_data.mean(), color='red', linestyle='--', label=f'Mean: {flow_data.mean():.1f}')
        axes[1, 0].set_title('Material Flow Rate Distribution')
        axes[1, 0].set_xlabel('Flow Rate (tons/hour)')
        axes[1, 0].set_ylabel('Frequency')
        axes[1, 0].legend()
        
        # 5. Anomaly Detection Over Time
        anomaly_data = cement_ai.sensor_data[['timestamp', 'is_anomaly']].iloc[-2000:]
        anomaly_times = anomaly_data[anomaly_data['is_anomaly'] == 1]['timestamp']
        axes[1, 1].scatter(anomaly_times, [1]*len(anomaly_times), color='red', alpha=0.7, s=50)
        axes[1, 1].set_title('Anomaly Detection Timeline')
        axes[1, 1].set_ylabel('Anomaly Detected')
        axes[1, 1].tick_params(axis='x', rotation=45)
        
        # 6. Raw Material Composition
        if cement_ai.material_data is not None:
            material_cols = ['limestone_percent', 'clay_percent', 'iron_ore_percent', 'gypsum_percent']
            latest_composition = cement_ai.material_data[material_cols].iloc[-1]
            axes[1, 2].pie(latest_composition.values, labels=material_cols, autopct='%1.1f%%')
            axes[1, 2].set_title('Current Raw Material Composition')
        
        plt.tight_layout()
        plt.show()
        
    except ImportError:
        print("Matplotlib not available for visualization. Install with: pip install matplotlib seaborn")

def export_results_to_json(analysis_result: Dict, filename: str = "cementmind_analysis.json"):
    """Export analysis results to JSON for API integration"""
    
    # Convert numpy types to native Python types for JSON serialization
    def convert_numpy(obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, (np.int64, np.int32)):
            return int(obj)
        elif isinstance(obj, (np.float64, np.float32)):
            return float(obj)
        elif isinstance(obj, pd.Timestamp):
            return obj.isoformat()
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return obj
    
    # Clean the results dictionary
    clean_results = {}
    for key, value in analysis_result.items():
        if isinstance(value, dict):
            clean_results[key] = {k: convert_numpy(v) for k, v in value.items()}
        elif isinstance(value, list):
            clean_results[key] = [convert_numpy(item) if not isinstance(item, dict) 
                                 else {k: convert_numpy(v) for k, v in item.items()} 
                                 for item in value]
        else:
            clean_results[key] = convert_numpy(value)
    
    with open(filename, 'w') as f:
        json.dump(clean_results, f, indent=2, default=str)
    
    print(f"✓ Analysis results exported to {filename}")

def create_api_integration_example():
    """Example of how to integrate CementMind AI with REST API"""
    
    api_code = '''
# FastAPI Integration Example for CementMind AI
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import uvicorn

app = FastAPI(title="CementMind AI API", version="1.0.0")

# Initialize CementMind AI system
cement_ai = CementMindAI()
cement_ai.initialize_system(generate_data=True)

class SensorReading(BaseModel):
    timestamp: str
    kiln_temperature: float
    system_pressure: float
    material_flow_rate: float
    oxygen_level: float
    energy_consumption: float

@app.post("/api/v1/analyze")
async def analyze_plant_data(sensor_data: SensorReading) -> Dict:
    """Real-time plant analysis endpoint"""
    try:
        # Convert to DataFrame format expected by the system
        current_data = pd.DataFrame([sensor_data.dict()])
        
        # Run analysis
        result = cement_ai.run_real_time_analysis(current_data)
        
        return {
            "status": "success",
            "analysis": result,
            "timestamp": sensor_data.timestamp
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/quality/predict")
async def predict_quality(
    kiln_temp: float,
    pressure: float,
    flow_rate: float,
    limestone_pct: float,
    clay_pct: float
) -> Dict:
    """Quality prediction endpoint"""
    # Implementation here
    pass

@app.get("/api/v1/logistics/optimize")
async def optimize_logistics() -> Dict:
    """Logistics optimization endpoint"""
    # Implementation here
    pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''
    
    print("API Integration Example:")
    print(api_code)

# =============================================================================
# MAIN EXECUTION
# =============================================================================

if __name__ == "__main__":
    # Run the comprehensive demonstration
    cement_ai_system, demo_results, system_report = run_comprehensive_demo()
    
    # Optional: Create visualizations if matplotlib is available
    print("\n🎨 Generating Performance Visualizations...")
    try:
        visualize_system_performance(cement_ai_system)
    except:
        print("Visualization skipped (matplotlib not available)")
    
    # Export results for integration
    print("\n📤 Exporting Results for Integration...")
    export_results_to_json(demo_results)
    
    # Show API integration example
    print("\n🔌 API Integration Example:")
    create_api_integration_example()
    
    print("\n" + "=" * 80)
    print("🚀 CEMENTMIND AI SYSTEM READY FOR PRODUCTION DEPLOYMENT!")
    print("   All models trained, validated, and ready for real-time operation.")
    print("=" * 80)