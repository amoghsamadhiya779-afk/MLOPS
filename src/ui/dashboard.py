import streamlit as st
import requests
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import os
import sys
import time
import random

# --- PATH SETUP ---
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.append(project_root)

from src.utils.data_loader import DataLoader

# --- CONFIGURATION ---
API_URL = os.getenv("API_URL", "http://localhost:5000")

st.set_page_config(
    page_title="Voyage Analytics Enterprise",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- SESSION STATE ---
if 'page' not in st.session_state:
    st.session_state.page = "Dashboard"
if 'theme' not in st.session_state:
    st.session_state.theme = "dark" 

def navigate_to(page_name):
    st.session_state.page = page_name

# --- DATA LOADING ---
@st.cache_data(ttl=3600) # Cache for 1 hour to prevent constant disk reads
def load_data_snapshot():
    loader = DataLoader()
    try:
        flights, hotels, users = loader.load_all_data()
        
        # Precompute IDs for joining later
        if hotels is not None and not hotels.empty:
            hotels['hotel_id'] = hotels['place'] + " - " + hotels['name']
            
        return flights, hotels, users
    except Exception as e:
        st.error(f"Data Loading Error: {e}")
        return None, None, None

flights_df, hotels_df, users_df = load_data_snapshot()

# --- GEO DATA ASSETS ---
CITY_COORDS = {
    "Recife (PE)": {"lat": -8.0476, "lon": -34.8770},
    "Florianopolis (SC)": {"lat": -27.5954, "lon": -48.5480},
    "Brasilia (DF)": {"lat": -15.7975, "lon": -47.8919},
    "Aracaju (SE)": {"lat": -10.9472, "lon": -37.0731},
    "Salvador (BH)": {"lat": -12.9777, "lon": -38.5016},
    "Campo Grande (MS)": {"lat": -20.4697, "lon": -54.6201},
    "Sao Paulo (SP)": {"lat": -23.5505, "lon": -46.6333},
    "Natal (RN)": {"lat": -5.7945, "lon": -35.2110},
    "Rio de Janeiro (RJ)": {"lat": -22.9068, "lon": -43.1729}
}

# --- THEME VARIABLES ---
T_ACCENT_ORANGE = "#FF6B00" 
T_ACCENT_GRADIENT = "linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)"

if st.session_state.theme == "dark":
    T_BG = "#0b0c10"
    T_SURFACE = "rgba(31, 40, 51, 0.8)" 
    T_TEXT_MAIN = "#c5c6c7"
    T_TEXT_HEAD = "#ffffff"
    T_BORDER = "1px solid rgba(255, 255, 255, 0.1)"
    T_DIVIDER = "1px solid rgba(255, 255, 255, 0.1)"
    T_SHADOW = "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
    PLOT_TEMPLATE = "plotly_dark"
else:
    T_BG = "#f0f2f5"
    T_SURFACE = "rgba(255, 255, 255, 0.85)" 
    T_TEXT_MAIN = "#1a1a1a"
    T_TEXT_HEAD = "#000000"
    T_BORDER = "1px solid rgba(0, 0, 0, 0.08)"
    T_DIVIDER = "1px solid rgba(0, 0, 0, 0.08)"
    T_SHADOW = "0 8px 32px 0 rgba(31, 38, 135, 0.1)"
    PLOT_TEMPLATE = "plotly_white"

# --- GLOBAL CSS ---
st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] {{
        font-family: 'Space Grotesk', sans-serif;
        background-color: {T_BG};
        color: {T_TEXT_MAIN};
    }}
    
    .stApp {{ background-color: {T_BG}; }}
    [data-testid="stSidebar"], #MainMenu, footer, header {{display: none;}}

    /* --- ANIMATIONS --- */
    @keyframes fadeIn {{
        from {{ opacity: 0; transform: translateY(20px); }}
        to {{ opacity: 1; transform: translateY(0); }}
    }}

    /* --- SLIDESHOW CSS --- */
    .slideshow-container {{
        position: relative;
        width: 100%;
        height: 350px;
        overflow: hidden;
        border-radius: 16px;
        box-shadow: {T_SHADOW};
        margin-bottom: 30px;
        border: {T_BORDER};
    }}
    
    .slide {{
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        animation: slideShow 15s infinite;
        background-size: cover;
        background-position: center;
    }}
    
    .slide:nth-child(1) {{ 
        background-image: url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop'); 
        animation-delay: 0s; 
    }}
    .slide:nth-child(2) {{ 
        background-image: url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2044&auto=format&fit=crop'); 
        animation-delay: 5s; 
    }}
    .slide:nth-child(3) {{ 
        background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'); 
        animation-delay: 10s; 
    }}

    @keyframes slideShow {{
        0% {{ opacity: 0; transform: scale(1.1); }}
        5% {{ opacity: 1; }}
        33% {{ opacity: 1; transform: scale(1); }}
        38% {{ opacity: 0; }}
        100% {{ opacity: 0; }}
    }}

    .slide-overlay {{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(0deg, {T_BG} 0%, rgba(0,0,0,0) 60%);
        z-index: 2;
    }}
    
    .slide-text {{
        position: absolute;
        bottom: 30px;
        left: 30px;
        z-index: 3;
        max-width: 600px;
    }}

    /* --- GLASSMORPHISM CONTAINERS --- */
    .glass-container {{
        background: {T_SURFACE};
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: {T_BORDER};
        border-radius: 16px;
        padding: 24px;
        box-shadow: {T_SHADOW};
        margin-bottom: 20px;
        animation: fadeIn 0.6s ease-out forwards;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }}
    
    .glass-container:hover {{
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(255, 107, 0, 0.15);
        border-color: {T_ACCENT_ORANGE};
    }}

    /* --- TYPOGRAPHY --- */
    h1, h2, h3 {{
        font-weight: 700;
        letter-spacing: -0.5px;
        color: {T_TEXT_HEAD};
    }}
    
    h1 {{ font-size: 3rem; margin-bottom: 0.5rem; }}
    h3 {{ font-size: 1.2rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1.5rem; color: {T_ACCENT_ORANGE}; }}

    /* --- METRICS --- */
    .metric-value {{
        font-size: 3rem;
        font-weight: 800;
        background: {T_ACCENT_GRADIENT};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.1;
    }}
    
    .metric-label {{
        font-size: 0.9rem;
        color: {T_TEXT_MAIN};
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.8;
    }}

    /* --- INPUTS & INTERACTIVITY --- */
    div[data-baseweb="select"] > div, div[data-baseweb="input"] > div {{
        background-color: {T_BG} !important;
        border: {T_BORDER};
        color: {T_TEXT_MAIN};
        border-radius: 8px;
        transition: all 0.3s ease;
    }}
    
    div[data-baseweb="select"] > div:hover, div[data-baseweb="input"] > div:hover {{
        border-color: {T_ACCENT_ORANGE};
    }}

    /* --- BUTTONS --- */
    div.stButton > button {{
        background: transparent;
        border: 1px solid {T_ACCENT_ORANGE};
        color: {T_ACCENT_ORANGE};
        border-radius: 50px;
        padding: 0.6rem 2rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s ease;
        width: 100%;
        position: relative;
        overflow: hidden;
    }}
    
    div.stButton > button:hover {{
        background: {T_ACCENT_ORANGE};
        color: #fff;
        box-shadow: 0 5px 15px rgba(255, 107, 0, 0.4);
        transform: scale(1.02);
    }}
    
    div.stButton > button:active {{
        transform: scale(0.98);
    }}

    /* --- NAVIGATION --- */
    .nav-bar {{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        margin-bottom: 2rem;
        background: {T_SURFACE};
        backdrop-filter: blur(10px);
        border-radius: 50px;
        border: {T_BORDER};
        box-shadow: {T_SHADOW};
    }}
    
    .nav-brand {{
        font-weight: 800;
        font-size: 1.8rem;
        letter-spacing: -1px;
        color: {T_TEXT_HEAD};
    }}
    
    /* --- WATERMARK --- */
    .watermark {{
        position: fixed;
        bottom: 20px;
        right: 20px;
        font-size: 0.8rem;
        color: {T_TEXT_MAIN};
        opacity: 0.5;
        border: 1px solid {T_ACCENT_ORANGE};
        padding: 6px 15px;
        border-radius: 10px;
        background-color: {T_SURFACE};
        backdrop-filter: blur(5px);
        z-index: 9999;
        transition: opacity 0.3s;
    }}
    .watermark:hover {{ opacity: 1; }}

    </style>
""", unsafe_allow_html=True)

# --- ROBUST API LOGIC ---
def safe_api_predict_price(payload):
    try:
        response = requests.post(f"{API_URL}/predict/price", json=payload, timeout=2)
        if response.status_code == 200:
            return response.json().get("predicted_price"), "Live API (Random Forest)"
    except:
        pass
    
    # Fallback Logic
    base = 200
    dist_rate = 0.5
    class_mult = {"firstClass": 2.5, "premium": 1.5, "economic": 1.0}
    price = (base + (payload['distance'] * dist_rate)) * class_mult.get(payload['flightType'], 1.0)
    return round(price * random.uniform(0.95, 1.05), 2), "Offline Heuristics"

def safe_api_predict_gender(payload):
    try:
        response = requests.post(f"{API_URL}/predict/gender", json=payload, timeout=2)
        if response.status_code == 200:
            return response.json().get("predicted_gender"), "Live API (Pipeline)"
    except:
        pass
    
    name = payload['name'].lower()
    return "female" if name[-1] in ['a', 'e', 'i', 'y'] else "male", "Offline Fallback"

def safe_api_recommend_hotels(user_code):
    """Hits the recommendation endpoint and returns a list of hotel IDs"""
    try:
        response = requests.post(f"{API_URL}/recommend", json={"userCode": int(user_code)}, timeout=3)
        if response.status_code == 200:
            return response.json().get("recommendations", []), "Live API (KNN Collaborative Filtering)"
    except Exception as e:
        pass
    
    return [], "Offline System (API Down)"

# --- LAYOUT COMPONENTS ---

def render_watermark():
    st.markdown(f'<div class="watermark">Lead Developer: Amogh Samadhiya</div>', unsafe_allow_html=True)

def render_header():
    st.markdown(f"""
    <div class="nav-bar">
        <div class="nav-brand">VOYAGE <span style="color:{T_ACCENT_ORANGE}">AI</span></div>
        <div style="font-size: 0.8rem; letter-spacing: 1px; color: {T_TEXT_MAIN}; opacity: 0.7;">ENTERPRISE MLOPS PLATFORM</div>
    </div>
    """, unsafe_allow_html=True)
    
    c1, c2, c3, c4, c5 = st.columns([1, 1, 1, 1, 1])
    
    with c1:
        if st.button("📊 DASHBOARD", use_container_width=True): navigate_to("Dashboard")
    with c2:
        if st.button("✈️ FLIGHTS", use_container_width=True): navigate_to("Flight Studio")
    with c3:
        if st.button("👤 IDENTITY", use_container_width=True): navigate_to("Identity Lab")
    with c4:
        if st.button("🏨 HOTELS", use_container_width=True): navigate_to("Hotel Concierge")
    with c5:
        label = "☀ LIGHT" if st.session_state.theme == "dark" else "🌙 DARK"
        if st.button(label, use_container_width=True):
            st.session_state.theme = "light" if st.session_state.theme == "dark" else "dark"
            st.rerun()

def render_hero_slideshow():
    st.markdown(f"""
    <div class="slideshow-container">
        <div class="slide"></div>
        <div class="slide"></div>
        <div class="slide"></div>
        <div class="slide-overlay"></div>
        <div class="slide-text">
            <h1 style="color:white; font-size: 2.5rem; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">Explore the Unseen</h1>
            <p style="color:white; font-size: 1.1rem; opacity: 0.9;">AI-Driven insights for the modern enterprise traveler.</p>
        </div>
    </div>
    """, unsafe_allow_html=True)

render_header()
render_watermark()

# --- PAGE: DASHBOARD ---
if st.session_state.page == "Dashboard":
    render_hero_slideshow()
    
    st.markdown(f"<p style='color:{T_TEXT_MAIN}; opacity:0.7; margin-bottom:2rem;'>Real-time analytics engine processing global travel data streams.</p>", unsafe_allow_html=True)
    
    # INTERACTIVITY: Dynamic Filtering
    if flights_df is not None:
        with st.expander("🔍 Filter Analytics Data", expanded=False):
            fc1, fc2, fc3 = st.columns(3)
            with fc1:
                sel_agency = st.multiselect("Select Agency", options=flights_df['agency'].unique(), default=[])
            with fc2:
                sel_type = st.multiselect("Flight Class", options=flights_df['flightType'].unique(), default=[])
            
            # Apply Filters
            filtered_flights = flights_df.copy()
            if sel_agency:
                filtered_flights = filtered_flights[filtered_flights['agency'].isin(sel_agency)]
            if sel_type:
                filtered_flights = filtered_flights[filtered_flights['flightType'].isin(sel_type)]
    else:
        filtered_flights = None

    # 1. Key Metrics (Glass Containers)
    m1, m2, m3, m4 = st.columns(4)
    
    with m1:
        st.markdown(f"""
        <div class="glass-container">
            <div class="metric-label">Flights Analyzed</div>
            <div class="metric-value">{f"{len(filtered_flights):,}" if filtered_flights is not None else "0"}</div>
        </div>
        """, unsafe_allow_html=True)
        
    with m2:
        st.markdown(f"""
        <div class="glass-container">
            <div class="metric-label">Active Users</div>
            <div class="metric-value">{f"{len(users_df):,}" if users_df is not None else "0"}</div>
        </div>
        """, unsafe_allow_html=True)
        
    with m3:
        avg = f"{filtered_flights['price'].mean():.0f}" if filtered_flights is not None and not filtered_flights.empty else "0"
        st.markdown(f"""
        <div class="glass-container">
            <div class="metric-label">Avg Ticket Price</div>
            <div class="metric-value">R$ {avg}</div>
        </div>
        """, unsafe_allow_html=True)
        
    with m4:
        # Check API Health dynamically
        try:
            api_status = "Online" if requests.get(f"{API_URL}/health", timeout=1).status_code == 200 else "Degraded"
            status_color = "#4CAF50" if api_status == "Online" else "#FF9800"
        except:
            api_status = "Offline"
            status_color = "#F44336"

        st.markdown(f"""
        <div class="glass-container">
            <div class="metric-label">API Health</div>
            <div class="metric-value" style="color: {status_color} !important; -webkit-text-fill-color: {status_color}; font-size: 2.5rem;">{api_status}</div>
        </div>
        """, unsafe_allow_html=True)

    # 2. Analytics Grid
    c1, c2 = st.columns([2, 1])
    
    with c1:
        st.markdown("<h3>Price Distribution Analysis</h3>", unsafe_allow_html=True)
        if filtered_flights is not None and not filtered_flights.empty:
            fig = px.histogram(filtered_flights, x="price", color="agency", nbins=50,
                               color_discrete_sequence=[T_ACCENT_ORANGE, "#333", "#666"])
            fig.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", 
                              font=dict(color=T_TEXT_MAIN, family="Space Grotesk"),
                              showlegend=True, template=PLOT_TEMPLATE, margin=dict(l=0,r=0,t=0,b=0))
            st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
            
    with c2:
        st.markdown("<h3>Corporate Client Share</h3>", unsafe_allow_html=True)
        if users_df is not None:
            fig2 = px.pie(users_df, names='company',
                            color_discrete_sequence=[T_ACCENT_ORANGE, "#FF8C00", "#FFD700"])
            fig2.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", 
                               font=dict(color=T_TEXT_MAIN, family="Space Grotesk"),
                               showlegend=False, template=PLOT_TEMPLATE, margin=dict(l=0,r=0,t=0,b=0))
            st.plotly_chart(fig2, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

    c3, c4 = st.columns(2)
    with c3:
        st.markdown("<h3>Flight Price vs Distance</h3>", unsafe_allow_html=True)
        if filtered_flights is not None and not filtered_flights.empty:
            sample_df = filtered_flights.sample(min(1000, len(filtered_flights)))
            fig3 = px.scatter(sample_df, x="distance", y="price", color="flightType",
                              color_discrete_sequence=[T_ACCENT_ORANGE, "#aaa", "#555"])
            fig3.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
                               font=dict(color=T_TEXT_MAIN, family="Space Grotesk"),
                               template=PLOT_TEMPLATE)
            st.plotly_chart(fig3, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

    with c4:
        st.markdown("<h3>Agency Performance</h3>", unsafe_allow_html=True)
        if filtered_flights is not None and not filtered_flights.empty:
            agency_counts = filtered_flights['agency'].value_counts().reset_index()
            agency_counts.columns = ['Agency', 'Count']
            fig4 = px.bar(agency_counts, x='Agency', y='Count',
                          color_discrete_sequence=[T_ACCENT_ORANGE])
            fig4.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
                               font=dict(color=T_TEXT_MAIN, family="Space Grotesk"),
                               template=PLOT_TEMPLATE)
            st.plotly_chart(fig4, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

# --- PAGE: FLIGHT STUDIO ---
elif st.session_state.page == "Flight Studio":
    st.markdown("<h1>Flight Price Engine</h1>", unsafe_allow_html=True)
    
    with st.form("flight_form"):
        c1, c2, c3, c4, c5 = st.columns(5)
        cities = list(CITY_COORDS.keys())
        
        with c1: origin = st.selectbox("Origin", cities, index=0)
        with c2: destination = st.selectbox("Destination", cities, index=1)
        with c3: agency = st.selectbox("Airline", ["FlyingDrops", "Rainbow", "CloudFy"])
        with c4: ftype = st.selectbox("Class", ["firstClass", "economic", "premium"])
        with c5: 
            st.markdown("<div style='margin-top: 28px'></div>", unsafe_allow_html=True)
            submit = st.form_submit_button("COMPUTE FARE")
    st.markdown("</div>", unsafe_allow_html=True)

    if submit:
        c_o = CITY_COORDS[origin]
        c_d = CITY_COORDS[destination]
        dist = int(((c_o['lat']-c_d['lat'])**2 + (c_o['lon']-c_d['lon'])**2)**0.5 * 100)
        
        payload = {"agency": agency, "flightType": ftype, "date": "2024-01-01", "distance": dist, "time": 2.0}
        price, status = safe_api_predict_price(payload)
        
        res1, res2 = st.columns([1, 2])
        
        with res1:
            st.markdown(f"""
            <div class="glass-container" style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <div class="metric-label">Estimated Fare</div>
                <div class="metric-value">R$ {price:.2f}</div>
                <div style="font-size: 0.8rem; color: {T_TEXT_MAIN}; opacity: 0.6; margin-top: 1rem;">Provider: {status}</div>
            </div>
            """, unsafe_allow_html=True)
            
        with res2:
            st.markdown(f"""<div class="glass-container">""", unsafe_allow_html=True)
            fig = go.Figure()
            fig.add_trace(go.Scattergeo(
                lon=[c_o["lon"], c_d["lon"]], lat=[c_o["lat"], c_d["lat"]],
                mode='lines+markers', line=dict(width=2, color=T_ACCENT_ORANGE),
                marker=dict(size=8, color=T_TEXT_HEAD)
            ))
            fig.update_layout(
                geo=dict(scope='south america', showland=True, 
                         landcolor=T_BG, 
                         countrycolor='#666', coastlinecolor='#666', bgcolor='rgba(0,0,0,0)'),
                margin=dict(l=0, r=0, t=0, b=0), paper_bgcolor='rgba(0,0,0,0)', height=300
            )
            st.plotly_chart(fig, use_container_width=True)
            st.markdown("</div>", unsafe_allow_html=True)

# --- PAGE: IDENTITY LAB ---
elif st.session_state.page == "Identity Lab":
    st.markdown("<h1>Identity Verification</h1>", unsafe_allow_html=True)
    
    col_input, col_viz = st.columns(2)
    
    with col_input:
        st.markdown("<h3>Passenger Details</h3>", unsafe_allow_html=True)
        
        # Interactive element: Pick a random existing user to populate form
        random_user = {"name": "Alex Smith", "company": "4You", "age": 30}
        if users_df is not None and not users_df.empty:
            if st.button("🎲 Auto-Fill from Database"):
                row = users_df.sample(1).iloc[0]
                random_user = {"name": row['name'], "company": row['company'], "age": int(row['age'])}

        name = st.text_input("Full Name", random_user['name'])
        company = st.selectbox("Company", ["4You", "Umbrella LTDA", "Wonka Industries"], index=["4You", "Umbrella LTDA", "Wonka Industries"].index(random_user['company']) if random_user['company'] in ["4You", "Umbrella LTDA", "Wonka Industries"] else 0)
        age = st.slider("Age", 18, 90, random_user['age'])
        
        if st.button("ANALYZE PROFILE"):
            payload = {"name": name, "company": company, "age": age}
            gender, status = safe_api_predict_gender(payload)
            
            st.markdown(f"""
            <div style="margin-top: 2rem; padding: 2rem; border-left: 4px solid {T_ACCENT_ORANGE}; background: {T_BG}; border-radius: 8px;">
                <div class="metric-label">Analysis Result</div>
                <div class="metric-value" style="font-size: 2.5rem;">{gender.upper()}</div>
                <div style="font-size: 0.8rem; margin-top: 0.5rem; color: {T_TEXT_MAIN};">Pipeline: {status}</div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    with col_viz:
        st.markdown("<h3>Demographic Distribution</h3>", unsafe_allow_html=True)
        if users_df is not None:
            fig = px.bar(users_df['gender'].value_counts().reset_index(), x='gender', y='count',
                         color_discrete_sequence=[T_ACCENT_ORANGE])
            fig.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", 
                              font=dict(color=T_TEXT_MAIN, family="Space Grotesk"), template=PLOT_TEMPLATE)
            st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    st.markdown(f"""<div class="glass-container">""", unsafe_allow_html=True)
    c_g1, c_g2 = st.columns(2)
    with c_g1:
        st.markdown("<h3>Age Distribution by Gender</h3>", unsafe_allow_html=True)
        if users_df is not None:
            fig_age = px.histogram(users_df, x="age", color="gender", nbins=20,
                                   color_discrete_sequence=[T_ACCENT_ORANGE, "#333", "#666"])
            fig_age.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
                                  font=dict(color=T_TEXT_MAIN, family="Space Grotesk"), template=PLOT_TEMPLATE)
            st.plotly_chart(fig_age, use_container_width=True)
            
    with c_g2:
        st.markdown("<h3>Company Distribution</h3>", unsafe_allow_html=True)
        if users_df is not None:
            fig_comp = px.bar(users_df['company'].value_counts().reset_index(), x='company', y='count',
                              color_discrete_sequence=[T_ACCENT_ORANGE])
            fig_comp.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
                                   font=dict(color=T_TEXT_MAIN, family="Space Grotesk"), template=PLOT_TEMPLATE)
            st.plotly_chart(fig_comp, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

# --- PAGE: HOTEL CONCIERGE ---
elif st.session_state.page == "Hotel Concierge":
    st.markdown("<h1>Accommodation Intelligence</h1>", unsafe_allow_html=True)
    
    c1, c2 = st.columns([1, 3])
    
    with c1:
        st.markdown("<h3>Search Criteria</h3>", unsafe_allow_html=True)
        
        # Real Interactive Element: Give them valid User IDs to test with
        valid_uids = users_df['userCode'].unique().tolist()[:10] if users_df is not None else [1001, 1002, 1003]
        uid = st.selectbox("Select User Profile (ID)", valid_uids)
        
        city = st.selectbox("Target City", list(CITY_COORDS.keys()))
        if st.button("GENERATE RECOMMENDATIONS"):
            st.session_state.h_search = True
            st.session_state.h_city = city
            st.session_state.h_uid = uid
        st.markdown("</div>", unsafe_allow_html=True)
            
    with c2:
        if st.session_state.get('h_search'):
            st.markdown(f"""<div class="glass-container">""", unsafe_allow_html=True)
            
            # --- THE REAL API CALL ---
            recommended_ids, status = safe_api_recommend_hotels(st.session_state.h_uid)
            st.markdown(f"<h3>AI Curated Selections for {st.session_state.h_city}</h3>", unsafe_allow_html=True)
            st.markdown(f"<p style='font-size: 0.8rem; color: {T_TEXT_MAIN}; opacity: 0.6;'>Engine: {status}</p>", unsafe_allow_html=True)
            
            final_hotels_to_display = []

            if recommended_ids and hotels_df is not None:
                # Filter real dataframe based on ML API output
                real_recs = hotels_df[hotels_df['hotel_id'].isin(recommended_ids)]
                # Filter by the city they selected
                city_recs = real_recs[real_recs['place'] == st.session_state.h_city]
                
                for _, row in city_recs.iterrows():
                    final_hotels_to_display.append({
                        "name": row['name'],
                        "rating": int(row.get('days', 4)), # Mocking rating with days for UI sake
                        "price": f"R$ {row['price']:.2f}"
                    })

            # Fallback if API is down or user has no data in that city
            if not final_hotels_to_display:
                if hotels_df is not None:
                    # Get top 3 most popular hotels in that city from the raw data
                    city_hotels = hotels_df[hotels_df['place'] == st.session_state.h_city]
                    top_city_hotels = city_hotels.groupby('name').agg({'price':'mean', 'days':'sum'}).sort_values('days', ascending=False).head(3).reset_index()
                    
                    for _, row in top_city_hotels.iterrows():
                        final_hotels_to_display.append({
                            "name": row['name'],
                            "rating": random.randint(3, 5), # Fallback mockup
                            "price": f"R$ {row['price']:.2f}"
                        })
                else:
                    # Absolute fallback if data failed to load
                    final_hotels_to_display = [{"name": "System Offline - Cannot load data", "rating": 0, "price": "R$ 0"}]
            
            # Render the results
            for h in final_hotels_to_display:
                st.markdown(f"""
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: {T_DIVIDER}; transition: background 0.3s;">
                    <div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: {T_TEXT_MAIN};">{h['name']}</div>
                        <div style="color: {T_ACCENT_ORANGE}; font-size: 0.9rem;">{'★' * h['rating']}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2rem; font-weight: 600;">{h['price']}</div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">per night</div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)
