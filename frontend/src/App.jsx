import React, { useEffect, useState, useRef, useCallback } from 'react';
import SignIn from "./components/SignIn.jsx";
import MenuScreen from "./components/MenuScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import LeaderboardScreen from "./components/LeaderboardScreen.jsx";
import AchievementsScreen from "./components/AchievementsScreen.jsx";
import GameOverScreen from "./components/GameOverScreen.jsx";
import './components/css/App.css';

// Authentication utility functions
const AUTH_STORAGE_KEY = 'mathNinjaAuth';

const saveAuthData = (username, email = null) => {
  const authData = {
    username,
    email,
    timestamp: Date.now(),
    isAuthenticated: true
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

const getAuthData = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    const authData = JSON.parse(stored);
    
    // Optional: Check if auth data is expired (e.g., after 30 days)
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - authData.timestamp > THIRTY_DAYS) {
      clearAuthData();
      return null;
    }
    
    return authData;
  } catch (error) {
    console.error('Error reading auth data:', error);
    clearAuthData();
    return null;
  }
};

const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export default function MathFruitNinja() {
  // Authentication and user state
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showWebcam, setShowWebcam] = useState(false);
  const [leaderboardScores, setLeaderboardScores] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Enhanced Game mechanics
  const [gameState, setGameState] = useState({
    fruits: [],
    score: 0,
    lives: 3,
    level: 1,
    timeLeft: 60
  });
  const [currentProblem, setCurrentProblem] = useState(null);
  const [gameTimer, setGameTimer] = useState(null);
  const [fruitSpawnTimer, setFruitSpawnTimer] = useState(null);
  const [slashEffects, setSlashEffects] = useState([]);
  
  // New features
  const [difficultyLevel, setDifficultyLevel] = useState('Medium');
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [powerUps, setPowerUps] = useState([]);
  const [totalFruitsAttempted, setTotalFruitsAttempted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [powerUpsUsed, setPowerUpsUsed] = useState(0);
  
  // Achievements system
  const [achievements, setAchievements] = useState([
    { id: 'first_game', name: 'First Steps', description: 'Play your first game', icon: '🎯', unlocked: false },
    { id: 'score_100', name: 'Century', description: 'Score 100 points', icon: '💯', unlocked: false },
    { id: 'combo_5', name: 'Combo Master', description: 'Get a 5x combo', icon: '🔥', unlocked: false },
    { id: 'perfect_game', name: 'Perfectionist', description: '100% accuracy in a game', icon: '⭐', unlocked: false },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Complete 10 problems in 30 seconds', icon: '⚡', unlocked: false }
  ]);

  // Hand tracking refs
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const [running, setRunning] = useState(false);

  // Enhanced authentication check on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔐 Checking authentication status...');
      
      // First, check if user is already authenticated in localStorage
      const savedAuth = getAuthData();
      
      if (savedAuth && savedAuth.isAuthenticated) {
        console.log('✅ Found saved authentication:', savedAuth.username);
        
        // Restore authentication state
        setUsername(savedAuth.username);
        setIsAuthenticated(true);
        setCurrentScreen('menu');
        
        // Optional: Verify with backend that user still exists
        try {
          const response = await fetch("http://127.0.0.1:5000/api/verify-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              username: savedAuth.username,
              email: savedAuth.email 
            })
          });
          
          if (!response.ok) {
            console.warn('⚠️ Backend verification failed, clearing auth');
            handleLogout();
            return;
          }
          
          const data = await response.json();
          if (!data.success) {
            console.warn('⚠️ User no longer exists in backend, clearing auth');
            handleLogout();
            return;
          }
          
          console.log('✅ Backend verification successful');
        } catch (error) {
          console.warn('⚠️ Backend verification failed (network error):', error.message);
          // Don't log out on network errors - allow offline usage
        }
      } else {
        console.log('❌ No saved authentication found');
        setCurrentScreen('signin');
      }
    };
    
    checkAuth();
  }, []);

  // Handle successful authentication
  const handleSignInSuccess = (authenticatedUsername, email = null) => {
    console.log('✅ Sign in successful:', authenticatedUsername);
    
    // Save authentication data to localStorage
    saveAuthData(authenticatedUsername, email);
    
    // Update state
    setUsername(authenticatedUsername);
    setIsAuthenticated(true);
    setCurrentScreen('menu');
  };

  // Handle logout with cleanup
  const handleLogout = () => {
    console.log('🚪 Logging out user:', username);
    
    // Clear localStorage
    clearAuthData();
    
    // Reset state
    setUsername('');
    setIsAuthenticated(false);
    
    // Stop any running game
    if (gameTimer) clearInterval(gameTimer);
    if (fruitSpawnTimer) clearInterval(fruitSpawnTimer);
    setRunning(false);
    
    // Reset game state
    setGameState({
      fruits: [],
      score: 0,
      lives: 3,
      level: 1,
      timeLeft: 60
    });
    
    // Go back to sign in
    setCurrentScreen('signin');
  };

  // Enhanced fetch leaderboard with error handling
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/leaderboard");
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();
      setLeaderboardScores(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      alert("Unable to load leaderboard. Please check your connection.");
    }
  };

  useEffect(() => {
    console.log('🎯 GAMESTATE CHANGED:', {
      lives: gameState.lives,
      score: gameState.score,
      timeLeft: gameState.timeLeft,
      fruitsCount: gameState.fruits?.length || 0
    });
  }, [gameState]);

  // Submit score with proper state capture and retry logic
  const submitScore = async (finalScore, finalLives, finalTimeLeft, stats) => {
    console.log('submitScore called with:', {
      username,
      finalScore,
      finalLives,
      finalTimeLeft,
      stats
    });
    
    const scoreData = {
      username,
      score: finalScore,
      lives: finalLives,
      timeLeft: finalTimeLeft,
      maxCombo: stats.maxCombo,
      accuracy: stats.accuracy,
      powerUpsUsed: stats.powerUpsUsed,
      difficulty: difficultyLevel
    };

    // Retry logic for better reliability
    let retries = 3;
    while (retries > 0) {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scoreData)
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Score submitted successfully:", data);
        return;
        
      } catch (err) {
        console.error(`Failed to submit score (attempt ${4-retries}):`, err);
        retries--;
        
        if (retries === 0) {
          alert("Unable to save your score. Please check your connection and try again.");
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  };

  // Enhanced math problem generator with difficulty levels
  const generateProblem = useCallback(() => {
    let operations, maxNum, includeDecimals, includeAlgebra;
    
    switch (difficultyLevel) {
      case 'Easy':
        operations = ['+', '-'];
        maxNum = 20;
        includeDecimals = false;
        includeAlgebra = false;
        break;
      case 'Medium':
        operations = ['+', '-', '*'];
        maxNum = 50;
        includeDecimals = Math.random() < 0.3;
        includeAlgebra = Math.random() < 0.2;
        break;
      case 'Hard':
        operations = ['+', '-', '*', '/'];
        maxNum = 100;
        includeDecimals = Math.random() < 0.5;
        includeAlgebra = Math.random() < 0.4;
        break;
      default:
        operations = ['+', '-'];
        maxNum = 50;
        includeDecimals = false;
        includeAlgebra = false;
    }

    if (includeAlgebra && Math.random() < 0.5) {
      // Algebra problem
      const b = Math.floor(Math.random() * maxNum/2) + 1;
      const answer = Math.floor(Math.random() * maxNum/2) + 1;
      const a = answer + b;
      return { question: `x + ${b} = ${a}`, answer };
    }

    if (includeDecimals && Math.random() < 0.3) {
      // Decimal problem
      const a = (Math.random() * maxNum/2).toFixed(1);
      const b = (Math.random() * maxNum/2).toFixed(1);
      const answer = (parseFloat(a) + parseFloat(b)).toFixed(1);
      return { question: `${a} + ${b}`, answer: parseFloat(answer) };
    }

    // Regular problems
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let a, b, answer, question;

    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * maxNum) + 1;
        b = Math.floor(Math.random() * maxNum) + 1;
        answer = a + b;
        question = `${a} + ${b}`;
        break;
      case '-':
        a = Math.floor(Math.random() * maxNum) + maxNum/2;
        b = Math.floor(Math.random() * a);
        answer = a - b;
        question = `${a} - ${b}`;
        break;
      case '*':
        a = Math.floor(Math.random() * Math.min(12, maxNum/4)) + 1;
        b = Math.floor(Math.random() * Math.min(12, maxNum/4)) + 1;
        answer = a * b;
        question = `${a} × ${b}`;
        break;
      case '/':
        b = Math.floor(Math.random() * Math.min(12, maxNum/4)) + 1;
        answer = Math.floor(Math.random() * Math.min(12, maxNum/4)) + 1;
        a = b * answer;
        question = `${a} ÷ ${b}`;
        break;
      default:
        a = 5; b = 3; answer = 8; question = `${a} + ${b}`;
    }

    return { question, answer };
  }, [difficultyLevel]);

  // Hand tracking controls
  const toggleTracking = () => {
    setRunning(prev => !prev);
  };

  const toggleWebcam = () => {
    setShowWebcam(prev => !prev);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  // Game flow functions
  const startGame = () => {
    console.log('Starting new game...');
    
    // Reset ALL game state first
    setRunning(false); // Stop any existing tracking
    
    // Clear timers
    if (gameTimer) {
      clearInterval(gameTimer);
      setGameTimer(null);
    }
    if (fruitSpawnTimer) {
      clearInterval(fruitSpawnTimer);
      setFruitSpawnTimer(null);
    }
    
    // Reset all state variables
    setCombo(0);
    setMaxCombo(0);
    setPowerUps([]);
    setTotalFruitsAttempted(0);
    setCorrectAnswers(0);
    setPowerUpsUsed(0);
    setSlashEffects([]);
    
    // Clear new achievement flags
    setAchievements(prev => prev.map(a => ({ ...a, isNew: false })));
    
    // Set initial game state
    const initialGameState = {
      fruits: [],
      score: 0,
      lives: 3,
      level: 1,
      timeLeft: 60
    };
    
    console.log('Setting initial game state:', initialGameState);
    setGameState(initialGameState);
    
    // Generate first problem
    setCurrentProblem(generateProblem());
    
    // Switch to game screen LAST
    setCurrentScreen('game');
  };

  // endGame with proper state capture and cleanup
  const endGame = useCallback((finalScore, finalLives, finalTimeLeft) => {
    console.log('endGame called with:', { finalScore, finalLives, finalTimeLeft });
    
    // Stop all timers immediately
    if (gameTimer) {
      console.log('Clearing game timer');
      clearInterval(gameTimer);
      setGameTimer(null);
    }
    if (fruitSpawnTimer) {
      console.log('Clearing fruit spawn timer');
      clearInterval(fruitSpawnTimer);
      setFruitSpawnTimer(null);
    }

    // Stop hand tracking
    setRunning(false);

    // Calculate final statistics
    const accuracy = totalFruitsAttempted > 0 ? 
      Math.round((correctAnswers / totalFruitsAttempted) * 100) : 0;
    
    const finalStats = {
      maxCombo,
      accuracy,
      powerUpsUsed
    };

    // Store final stats for display
    window.finalGameStats = finalStats;
    
    // Submit score (don't block UI transition)
    submitScore(finalScore, finalLives, finalTimeLeft, finalStats);
    
    // Transition to game over screen
    console.log('Transitioning to game over screen');
    setCurrentScreen('gameOver');
  }, [gameTimer, fruitSpawnTimer, totalFruitsAttempted, correctAnswers, maxCombo, powerUpsUsed, submitScore, difficultyLevel, username]);

  const cutFruit = (fruitId) => {
    // This will be handled in GameScreen component
    console.log('Cut fruit:', fruitId);
  };

  // Navigation handlers
  const handleStartGame = () => startGame();
  
  const handleShowLeaderboard = () => {
    fetchLeaderboard();
    setCurrentScreen('leaderboard');
  };
  
  const handleShowAchievements = () => setCurrentScreen('achievements');
  
  const handleBackToMenu = () => setCurrentScreen('menu');

  // Loading screen with better UX
  if (currentScreen === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1>🥷 Math Fruit Ninja</h1>
          <div className="loading-spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Render screens
  return (
    <div className={`math-fruit-ninja ${theme}`}>
      {currentScreen === 'signin' && (
        <SignIn onSuccess={handleSignInSuccess} />
      )}
      
      {currentScreen === 'menu' && (
        <MenuScreen
          username={username}
          onStartGame={handleStartGame}
          onShowLeaderboard={handleShowLeaderboard}
          onShowAchievements={handleShowAchievements}
          onLogout={handleLogout}
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
      )}
      
      {currentScreen === 'game' && (
        <GameScreen
          videoRef={videoRef}
          overlayRef={overlayRef}
          running={running}
          onToggleRunning={toggleTracking}
          gameState={gameState}
          onCutFruit={cutFruit}
          theme={theme}
          currentProblem={currentProblem}
          score={gameState.score}
          lives={gameState.lives}
          timeLeft={gameState.timeLeft}
          onBackToMenu={handleBackToMenu}
          slashEffects={slashEffects}
          showWebcam={showWebcam}
          onToggleWebcam={toggleWebcam}
          combo={combo}
          difficultyLevel={difficultyLevel}
          onDifficultyChange={setDifficultyLevel}
          powerUps={powerUps}
          achievements={achievements}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          setGameState={setGameState}
          setCurrentProblem={setCurrentProblem}
          generateProblem={generateProblem}
          setCombo={setCombo}
          setMaxCombo={setMaxCombo}
          setPowerUps={setPowerUps}
          setTotalFruitsAttempted={setTotalFruitsAttempted}
          setCorrectAnswers={setCorrectAnswers}
          setPowerUpsUsed={setPowerUpsUsed}
          setSlashEffects={setSlashEffects}
          setAchievements={setAchievements}
          totalFruitsAttempted={totalFruitsAttempted}
          correctAnswers={correctAnswers}
          maxCombo={maxCombo}
          powerUpsUsed={powerUpsUsed}
          endGame={endGame}
          gameTimer={gameTimer}
          setGameTimer={setGameTimer}
          fruitSpawnTimer={fruitSpawnTimer}
          setFruitSpawnTimer={setFruitSpawnTimer}
        />
      )}
      
      {currentScreen === 'leaderboard' && (
        <LeaderboardScreen
          scores={leaderboardScores}
          onBack={handleBackToMenu}
          theme={theme}
        />
      )}
      
      {currentScreen === 'achievements' && (
        <AchievementsScreen
          achievements={achievements}
          onBack={handleBackToMenu}
          theme={theme}
        />
      )}
      
      {currentScreen === 'gameOver' && (
        <GameOverScreen
          score={gameState.score}
          finalStats={window.finalGameStats || { maxCombo: 0, accuracy: 0, powerUpsUsed: 0 }}
          isNewHighScore={leaderboardScores.length === 0 || gameState.score > Math.max(...leaderboardScores.map(s => s.score || 0))}
          onRestart={startGame}
          onBackToMenu={handleBackToMenu}
          theme={theme}
        />
      )}
    </div>
  );
}