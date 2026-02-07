# Space Debris Risk Intelligence Dashboard
## 🚀 GETTING STARTED - 5-MINUTE QUICKSTART

### What You're About to Run

A **conference-grade analytics dashboard** with 5 integrated analytics features:

1. **Risk Evolution** - See how collision risk changes over time
2. **Anomaly Detection** - Detect unusual debris growth patterns  
3. **Forecasting** - Predict future high-risk orbital regions
4. **Explainability** - Understand WHY risk is changing
5. **Decision Support** - Compare regions and make informed decisions

All in one beautiful, space-themed dashboard.

---

## 📋 Prerequisites

### Required
- **Node.js** 14.0 or higher ([Download](https://nodejs.org/))
- **npm** 6.0 or higher (comes with Node.js)

### Verify Installation
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show 6.0.0 or higher
```

---

## 🎬 Quick Start (Choose Your Platform)

### Option A: Windows Users 💻

1. **Run the startup script:**
   ```
   Double-click: start.bat
   ```
   This will:
   - Check your installation
   - Install dependencies automatically
   - Launch both servers in new windows
   - Open the dashboard

2. **Wait for the dashboard to load** (~30 seconds after script starts)

3. **Open browser:** http://localhost:3000

### Option B: macOS/Linux Users 🍎 🐧

1. **Make script executable:**
   ```bash
   chmod +x start.sh
   ```

2. **Run startup script:**
   ```bash
   ./start.sh
   ```

3. **Open browser:** http://localhost:3000

### Option C: Manual Setup (All Platforms)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
# You should see: "Space Debris API Server Running on Port 5000"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
# Browser will open to http://localhost:3000
```

---

## 🎨 What You'll See

The dashboard has a **dark space theme** with **5 main panels**:

```
┌─────────────────────────────────────────────────┐
│  🛰️ Space Debris Risk Intelligence Dashboard   │  ← Header with KPIs
├─────────────────────────────────────────────────┤
│ Time Window: Last 30 days  │  Altitude: 300-2000 km │
├─────────────────────────────────────────────────┤
│
│ 📈 RISK EVOLUTION     │  ⚠️ ANOMALY ALERTS   │
│ (Line chart showing   │  (Active anomalies   │
│  risk over time)      │   with severity)     │
│                       │                      │
├───────────────────────┼──────────────────────┤
│
│ 🔮 HOTSPOT FORECAST   │  🧠 RISK EXPLANATION │
│ (Future risk regions) │  (Why risk changed)  │
│
├─────────────────────────────────────────────────┤
│
│        🎯 DECISION SUPPORT & COMPARISON        │
│        (Compare regions side-by-side)          │
│
└─────────────────────────────────────────────────┘
```

### Interactive Features

- **Time Window Slider** - Switch between 7/30/90/180 day views
- **Altitude Range** - Adjust orbital altitude filter
- **Refresh Buttons** - Update individual panels
- **Region Comparison** - Select 2 regions to compare
- **Anomaly Filters** - Adjust detection sensitivity

---

## ✅ Everything Working? Here's What to Try

### Test 1: Load the Dashboard
- Open http://localhost:3000
- Should load within 2-3 seconds
- You'll see synthetic debris data

### Test 2: Check the Backend
- Open http://localhost:5000/api/health
- You should see: `{"status":"healthy"}`

### Test 3: Interact with Panels
Click on the **Refresh button** (↻) in each panel to reload data

### Test 4: Change Filters
- Move the time window slider
- Adjust altitude range
- Switch comparison regions

---

## 🐛 Troubleshooting

### "Command not found: node"
**Solution**: Node.js not installed or not in PATH
```bash
# Check if installed
node --version

# If not, download from https://nodejs.org/
```

### "Port 5000 already in use"
**Solution**: Another process is using the port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### "Port 3000 already in use"
Same as above but for port 3000

### Dashboard doesn't load
**Check**:
- Backend is running (check Terminal 1)
- Frontend is running (check Terminal 2)
- No errors in browser console (F12)
- Try clearing cache (Ctrl+Shift+Delete)

### "npm install" fails
**Solution**: Clear cache and retry
```bash
npm cache clean --force
npm install
```

### Blank dashboard or broken charts
**Solution**: Refresh the page (Ctrl+R or Cmd+R)

### Still not working?
See the full troubleshooting guide in `docs/SETUP.md`

---

## 📊 Exploring the Dashboard

### 1. Risk Evolution Panel
- **What it shows**: How collision risk changes over time
- **Try this**: Change the time window from 30 to 90 days
- **Look for**: The "Trend" indicator (increasing/stable/decreasing)

### 2. Anomaly Detection Panel
- **What it shows**: Detected debris growth spikes
- **Try this**: Change sensitivity from "medium" to "high"
- **Look for**: Red severity badges and recommendations

### 3. Forecasting Panel
- **What it shows**: Predicted future hotspots
- **Try this**: Increase forecast horizon to 60 days
- **Look for**: Hotspot intensity bars

### 4. Explainability Panel
- **What it shows**: WHY risk increased
- **Try this**: Switch time range from 7d to 30d
- **Look for**: Factor contribution percentages

### 5. Decision Support Panel
- **What it shows**: Side-by-side region comparison
- **Try this**: Select different altitude regions from dropdowns
- **Look for**: "Higher" vs "Lower" comparisons

---

## 💡 Pro Tips

### Speed Up Loading
- Use shorter time windows (7-30 days)
- Use specific altitude ranges
- Close other browser tabs

### Take Better Screenshots
- Use Firefox/Chrome for best rendering
- Open DevTools to zoom: Ctrl+Shift+K then "Zoom"
- Dark theme looks better in dark environment

### Share with Others
- Dashboard is automatically accessible on your local network
- Replace `localhost` with your IP address
- Example: `http://192.168.1.100:3000`

### Stop Both Servers
- **Windows**: Close both black console windows
- **Mac/Linux**: Press Ctrl+C in the terminal

---

## 📚 Next Steps

### Learn More
- Read `README.md` for full feature list
- See `docs/SETUP.md` for detailed configuration
- Check `docs/ARCHITECTURE.md` for technical details

### Customize the Dashboard
- Edit colors in `frontend/src/styles/`
- Modify chart types in component files
- Adjust analytics settings in `backend/server.js`

### Integrate Real Data
- Configure Space-Track credentials in `backend/.env`
- Uncomment data ingestion code in `server.js`
- Switch to live debris data instead of synthetic

### Deploy to Production
- See deployment section in `docs/README.md`
- Use Docker for containerization
- Set up proper authentication & security

---

## 🎯 What's Included

✅ **Full working dashboard**
✅ **5 integrated analytics features**
✅ **Synthetic demo data**
✅ **Space-themed UI**
✅ **Responsive design**
✅ **Complete documentation**
✅ **Ready for customization**

---

## ⚠️ Important Notes

### This Dashboard Is
- ✅ A visualization & analytics tool
- ✅ For research & educational purposes
- ✅ An operator decision-support aid
- ✅ Conference presentation ready

### This Dashboard Is NOT
- ❌ A collision avoidance system
- ❌ A satellite control system
- ❌ For operational space tracking (use official SSA systems)
- ❌ An automated decision-making system

---

## 🆘 Still Need Help?

1. **Check browser console** - Press F12, look for errors
2. **Read docs/SETUP.md** - Common issues & solutions
3. **Review terminal output** - Look for error messages
4. **Verify ports are free** - Check if 5000 & 3000 available

---

## 🎉 You're Ready!

### Next: Run the Dashboard

**Windows:** Double-click `start.bat`
**Mac/Linux:** Run `./start.sh`

The dashboard will open in your browser at **http://localhost:3000**

---

**Enjoy exploring the Space Debris Risk Intelligence Dashboard!** 🛰️✨

*Last Updated: February 2026*
