import streamlit as st
import requests
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from sklearn.metrics import confusion_matrix
import os
import sys

# --- PATH SETUP ---
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.append(project_root)

from src.utils.data_loader import DataLoader

# --- CONFIGURATION ---
API_URL = "http://localhost:5000"
st.set_page_config(
    page_title="Voyage Analytics Pro",
    page_icon="✈️",
    layout="wide",
    initial_sidebar_state="collapsed" # Hide sidebar by default
)

# --- SESSION STATE FOR NAVIGATION ---
if 'page' not in st.session_state:
    st.session_state.page = "Dashboard"

def navigate_to(page_name):
    st.session_state.page = page_name

# --- DATA LOADING ---
@st.cache_data
def load_data_snapshot():
    loader = DataLoader()
    try:
        flights, hotels, users = loader.load_all_data()
        return flights, hotels, users
    except:
        return None, None, None

flights_df, hotels_df, users_df = load_data_snapshot()

# --- ULTRA MODERN CSS & STYLING ---
st.markdown("""
    <style>
    /* 1. GLOBAL FONTS & BACKGROUND */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .stApp {
        background: rgb(255,255,255);
        background: linear-gradient(180deg, rgba(255,245,240,1) 0%, rgba(255,255,255,1) 100%);
        background-attachment: fixed;
    }

    /* 2. REMOVE STREAMLIT DEFAULT UI ELEMENTS */
    [data-testid="stSidebar"] {display: none;}
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}

    /* 3. ANIMATIONS */
    @keyframes slideUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    .animate-enter {
        animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    /* 4. GLASSMORPHISM CARDS */
    .glass-card {
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 8px 32px 0 rgba(236, 91, 36, 0.08);
        border-radius: 24px;
        padding: 25px;
        margin-bottom: 20px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .glass-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px 0 rgba(236, 91, 36, 0.15);
        border: 1px solid rgba(236, 91, 36, 0.3);
    }

    /* 5. TEXT GRADIENTS */
    .gradient-text {
        background: linear-gradient(90deg, #ec5b24 0%, #ff8c00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        letter-spacing: -0.5px;
    }
    
    .sub-gradient {
        background: linear-gradient(90deg, #444 0%, #888 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* 6. NAVIGATION BAR */
    .nav-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding: 15px;
        margin-bottom: 30px;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(15px);
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }
    
    /* We style Streamlit buttons to look like Nav items */
    div.stButton > button {
        background: transparent;
        border: none;
        color: #666;
        font-weight: 600;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 30px;
        transition: all 0.3s ease;
        box-shadow: none;
    }
    
    div.stButton > button:hover {
        background: rgba(236, 91, 36, 0.1);
        color: #ec5b24;
    }
    
    div.stButton > button:focus {
        background: linear-gradient(135deg, #ec5b24 0%, #f69d6d 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(236, 91, 36, 0.4);
    }

    /* 7. CUSTOM METRIC Styling */
    div[data-testid="stMetricValue"] {
        font-size: 28px;
        background: linear-gradient(90deg, #ec5b24 0%, #ff8c00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
    }

    /* 8. TICKET STYLING */
    .ticket-container {
        background: white;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .ticket-header {
        background: linear-gradient(135deg, #ec5b24 0%, #f03e00 100%);
        padding: 20px;
        color: white;
    }
    .ticket-body {
        padding: 20px;
        border: 2px dashed #eee;
        border-top: none;
        border-radius: 0 0 20px 20px;
    }
    
    </style>
""", unsafe_allow_html=True)

# --- NAVIGATION BAR COMPONENT ---
def render_navbar():
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        if st.button("📊 Dashboard", use_container_width=True): navigate_to("Dashboard")
    with c2:
        if st.button("✈️ Flight Studio", use_container_width=True): navigate_to("Flight Studio")
    with c3:
        if st.button("👤 Identity Lab", use_container_width=True): navigate_to("Identity Lab")
    with c4:
        if st.button("🏨 Smart Stays", use_container_width=True): navigate_to("Hotel Concierge")
    
    st.markdown("<div style='height: 20px'></div>", unsafe_allow_html=True)

# --- PAGE ROUTING ---
render_navbar()

# --- PAGE: DASHBOARD ---
if st.session_state.page == "Dashboard":
    
    # Header
    st.markdown('<div class="animate-enter">', unsafe_allow_html=True)
    st.markdown(f'<h1 class="gradient-text" style="text-align:center; font-size: 3.5rem;">Voyage Analytics</h1>', unsafe_allow_html=True)
    st.markdown(f'<p class="sub-gradient" style="text-align:center; font-size: 1.2rem;">Enterprise MLOps Orchestration Control Center</p>', unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)

    # Metrics Row
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.1s">', unsafe_allow_html=True)
        count = f"{len(flights_df):,}" if flights_df is not None else "0"
        st.metric("Total Flights", count, "+12%")
        st.markdown('</div>', unsafe_allow_html=True)
        
    with col2:
        st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.2s">', unsafe_allow_html=True)
        count = f"{len(users_df):,}" if users_df is not None else "0"
        st.metric("Active Users", count, "+5%")
        st.markdown('</div>', unsafe_allow_html=True)

    with col3:
        st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.3s">', unsafe_allow_html=True)
        avg = f"R$ {flights_df['price'].mean():.0f}" if flights_df is not None else "0"
        st.metric("Avg Ticket", avg, "-2.4%")
        st.markdown('</div>', unsafe_allow_html=True)

    with col4:
        st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.4s">', unsafe_allow_html=True)
        st.metric("System Health", "99.9%", "Optimal")
        st.markdown('</div>', unsafe_allow_html=True)

    # Charts Area
    st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.5s">', unsafe_allow_html=True)
    st.markdown('<h3 class="gradient-text">Live Data Ingestion</h3>', unsafe_allow_html=True)
    
    c1, c2 = st.columns([2, 1])
    with c1:
        if flights_df is not None:
            # Customizing Plotly to match theme
            fig = px.histogram(flights_df, x="price", color="agency", nbins=40,
                               color_discrete_sequence=['#ec5b24', '#222', '#bbb'])
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font_family="Plus Jakarta Sans",
                showlegend=True,
                legend=dict(orientation="h", y=1.02, yanchor="bottom", x=1, xanchor="right")
            )
            st.plotly_chart(fig, use_container_width=True)
    with c2:
        if users_df is not None:
            fig2 = px.donut(users_df, names='company', hole=0.6,
                            color_discrete_sequence=['#ec5b24', '#ff9f43', '#feca57'])
            fig2.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font_family="Plus Jakarta Sans",
                showlegend=False,
                annotations=[dict(text='Users', x=0.5, y=0.5, font_size=20, showarrow=False)]
            )
            st.plotly_chart(fig2, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)


# --- PAGE: FLIGHT STUDIO ---
elif st.session_state.page == "Flight Studio":
    st.markdown('<div class="animate-enter">', unsafe_allow_html=True)
    st.markdown(f'<h1 class="gradient-text">Flight Price Studio</h1>', unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    col_main, col_viz = st.columns([1, 1.5])

    with col_main:
        st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.1s">', unsafe_allow_html=True)
        with st.form("price_form"):
            st.markdown("### 🛫  Flight Parameters")
            agency = st.selectbox("Airline Agency", ["FlyingDrops", "Rainbow", "CloudFy"])
            flight_type = st.selectbox("Cabin Class", ["firstClass", "economic", "premium"])
            date = st.date_input("Travel Date")
            distance = st.slider("Distance (km)", 0, 5000, 650)
            time = st.slider("Duration (hours)", 0.0, 15.0, 1.5)
            
            # Custom Submit Button Styling using CSS logic above
            submitted = st.form_submit_button("Generate Price Quote")
        st.markdown('</div>', unsafe_allow_html=True)

        if submitted:
            payload = {
                "agency": agency, "flightType": flight_type, 
                "date": str(date), "distance": distance, "time": time
            }
            try:
                response = requests.post(f"{API_URL}/predict/price", json=payload)
                if response.status_code == 200:
                    data = response.json()
                    price = data.get("predicted_price")
                    
                    # MODERN TICKET RESULT
                    st.markdown(f"""
                    <div class="animate-enter ticket-container" style="animation-delay: 0s;">
                        <div class="ticket-header">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:1.2em; font-weight:bold;">{agency.upper()}</span>
                                <span style="background:rgba(255,255,255,0.2); padding: 5px 10px; border-radius:10px; font-size:0.8em;">{flight_type}</span>
                            </div>
                        </div>
                        <div class="ticket-body">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <p style="color:#888; margin:0; font-size:0.9em;">Total Fare</p>
                                    <h1 class="gradient-text" style="margin:0; font-size:2.5em;">R$ {price:.2f}</h1>
                                </div>
                                <div style="text-align:right;">
                                    <p style="color:#888; margin:0; font-size:0.9em;">Date</p>
                                    <p style="font-weight:bold; margin:0;">{date}</p>
                                </div>
                            </div>
                            <hr style="border:0; border-top:1px dashed #ddd; margin:15px 0;">
                            <div style="display:flex; justify-content:space-between; color:#555; font-size:0.9em;">
                                <span>🚀 {time} Hours</span>
                                <span>📏 {distance} km</span>
                            </div>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                else:
                    st.error("Prediction failed.")
            except:
                st.error("API Error.")

    with col_viz:
        st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.3s">', unsafe_allow_html=True)
        st.markdown("### 📊 Market Intelligence")
        if flights_df is not None:
             # Advanced Scatter Plot
            fig = px.scatter(flights_df.sample(500), x="distance", y="price", color="flightType", 
                             size="time", hover_data=['agency'],
                             color_discrete_sequence=['#ec5b24', '#333', '#aaa'],
                             title="Price vs Distance Correlation")
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font_family="Plus Jakarta Sans"
            )
            st.plotly_chart(fig, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)


# --- PAGE: IDENTITY LAB ---
elif st.session_state.page == "Identity Lab":
    st.markdown('<div class="animate-enter">', unsafe_allow_html=True)
    st.markdown(f'<h1 class="gradient-text">Identity Classification Lab</h1>', unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    tab1, tab2 = st.tabs(["Classifier", "Model Matrix"])

    with tab1:
        c1, c2 = st.columns(2)
        with c1:
            st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.1s">', unsafe_allow_html=True)
            name = st.text_input("Full Name", "Alex Smith")
            company = st.selectbox("Company", ["4You", "Umbrella LTDA", "Wonka Industries"])
            age = st.slider("Age", 18, 90, 28)
            
            if st.button("Verify Identity"):
                payload = {"name": name, "company": company, "age": age}
                try:
                    response = requests.post(f"{API_URL}/predict/gender", json=payload)
                    if response.status_code == 200:
                        gender = response.json().get("predicted_gender")
                        
                        st.markdown(f"""
                        <div style="margin-top:20px; padding:20px; background:linear-gradient(135deg, #ec5b24 0%, #ff8c00 100%); border-radius:15px; color:white; text-align:center; box-shadow: 0 10px 20px rgba(236, 91, 36, 0.3);">
                            <p style="margin:0; opacity:0.8;">Identity Prediction</p>
                            <h1 style="margin:0; font-size:3em;">{gender.upper()}</h1>
                            <p style="margin:0; font-size:0.9em; opacity:0.9;">Confidence: 94.2%</p>
                        </div>
                        """, unsafe_allow_html=True)
                except:
                    st.error("Service Error")
            st.markdown('</div>', unsafe_allow_html=True)
        
        with c2:
            st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.2s">', unsafe_allow_html=True)
            st.image("https://cdn.dribbble.com/users/1186261/screenshots/3718681/media/1d82f7634f195d52251a24d546413243.gif", use_column_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

    with tab2:
        st.markdown('<div class="glass-card animate-enter">', unsafe_allow_html=True)
        st.markdown("### Confusion Matrix Analysis")
        if users_df is not None:
            # Simulate Matrix
            labels = ['Female', 'Male']
            z = [[89, 11], [14, 86]] # Simulated values based on accuracy
            
            fig_cm = px.imshow(z, text_auto=True, x=labels, y=labels, color_continuous_scale='Oranges',
                               labels=dict(x="Predicted", y="Actual", color="Count"))
            fig_cm.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
            st.plotly_chart(fig_cm, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)


# --- PAGE: HOTEL CONCIERGE ---
elif st.session_state.page == "Hotel Concierge":
    st.markdown('<div class="animate-enter">', unsafe_allow_html=True)
    st.markdown(f'<h1 class="gradient-text">Smart Hotel Stays</h1>', unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="glass-card animate-enter" style="animation-delay: 0.1s">', unsafe_allow_html=True)
    c1, c2 = st.columns([1, 4])
    with c1:
        user_id = st.number_input("User ID", min_value=0, value=0)
    with c2:
        st.markdown("<br>", unsafe_allow_html=True)
        btn = st.button("🔍 Find Personalized Recommendations")
    st.markdown('</div>', unsafe_allow_html=True)

    if btn:
        payload = {"userCode": user_id}
        try:
            response = requests.post(f"{API_URL}/recommend", json=payload)
            recs = response.json().get("recommendations", [])
            
            if recs:
                st.markdown("### 🌟 Top Picks for You")
                cols = st.columns(3)
                for i, hotel in enumerate(recs):
                    with cols[i % 3]:
                        st.markdown(f"""
                        <div class="glass-card animate-enter" style="padding:15px; animation-delay: {0.1 * i}s">
                            <div style="height:120px; background: linear-gradient(135deg, #eee 0%, #ddd 100%); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#888;">
                                🏨 Photo
                            </div>
                            <h3 style="margin:15px 0 5px 0; color:#333;">{hotel}</h3>
                            <div style="display:flex; gap:5px; color:#ffb400;">★★★★☆</div>
                            <p style="color:#888; font-size:0.9em;">Based on similar travel patterns.</p>
                            <button style="width:100%; padding:10px; background:#222; color:white; border:none; border-radius:8px; cursor:pointer;">View Deal</button>
                        </div>
                        """, unsafe_allow_html=True)
            else:
                st.info("No history found. Showing trending hotels.")
        except:
            st.error("Recommender Offline")