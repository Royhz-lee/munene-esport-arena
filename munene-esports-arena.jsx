import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data and styles
const TOURNAMENTS = [
  { id: 1, name: 'eFootball Premier Cup 2026', type: 'Paid', entryFee: 500, players: 64, prize: 32000, stage: 'Round of 16', status: 'active' },
  { id: 2, name: 'Bronze League Sprint', type: 'Free', entryFee: 0, players: 128, prize: 5000, stage: 'Group Stage', status: 'active' },
  { id: 3, name: 'Weekend Warriors Invitational', type: 'Sponsored', entryFee: 1000, players: 32, prize: 50000, stage: 'Registration', status: 'upcoming' },
  { id: 4, name: 'Silver League Championship', type: 'Paid', entryFee: 2000, players: 256, prize: 100000, stage: 'Finals', status: 'active' },
  { id: 5, name: 'Gold League Elite', type: 'Paid', entryFee: 5000, players: 16, prize: 80000, stage: 'Semi Finals', status: 'active' },
];

const LEAGUES = [
  { id: 1, name: 'Bronze League', tier: 'Bronze', entryFee: 200, members: 500, minRank: 0 },
  { id: 2, name: 'Silver League', tier: 'Silver', entryFee: 500, members: 300, minRank: 1000 },
  { id: 3, name: 'Gold League', tier: 'Gold', entryFee: 1200, members: 150, minRank: 5000 },
  { id: 4, name: 'Platinum League', tier: 'Platinum', entryFee: 3000, members: 50, minRank: 20000 },
  { id: 5, name: 'Champions League', tier: 'Champion', entryFee: 10000, members: 10, minRank: 100000 },
];

const MuneneEsportsArena = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [playerData, setPlayerData] = useState(null);
  const [adminStats, setAdminStats] = useState(null);

  // Mock login
  const handleLogin = (role) => {
    if (role === 'player') {
      const player = {
        id: 'P001',
        username: 'Champion_Ken',
        email: 'ken@example.com',
        rank: 4500,
        wallet: 2500,
        tournaments_joined: 3,
        winnings: 5000,
        kycStatus: 'approved',
        profilePicture: '👤',
        joinedAt: '2025-06-15'
      };
      setCurrentUser(player);
      setPlayerData(player);
      setUserRole('player');
      setCurrentPage('player-dashboard');
    } else if (role === 'admin') {
      setCurrentUser({ id: 'ADMIN001', username: 'Admin_Panel' });
      setUserRole('admin');
      setAdminStats({
        totalUsers: 2547,
        totalRevenue: 125000,
        activeTourn: 8,
        pendingWithdrawals: 12,
        usersThisMonth: 340,
        revenueThisMonth: 28500
      });
      setCurrentPage('admin-dashboard');
    } else if (role === 'sponsor') {
      setCurrentUser({ id: 'SPONSOR001', username: 'Sponsor_Corp' });
      setUserRole('sponsor');
      setCurrentPage('sponsor-portal');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setCurrentPage('login');
    setPlayerData(null);
  };

  const updateWallet = (amount) => {
    if (playerData) {
      const updated = { ...playerData, wallet: playerData.wallet + amount };
      setPlayerData(updated);
      setCurrentUser(updated);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#f1f5f9', fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}>
      {/* Navigation */}
      {currentUser && (
        <nav style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⚡ Munene Arena</div>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Compete. Win. Rise Through the Leagues.</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#cbd5e1' }}>👤 {currentUser.username}</span>
            {userRole === 'player' && (
              <span style={{ background: '#0f766e', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>Rank: {playerData?.rank}</span>
            )}
            <button onClick={handleLogout} style={{ background: '#334155', color: '#f1f5f9', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}>Logout</button>
          </div>
        </nav>
      )}

      {/* Pages */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Login Page */}
        {currentPage === 'login' && (
          <LoginPage handleLogin={handleLogin} />
        )}

        {/* Player Dashboard */}
        {currentPage === 'player-dashboard' && playerData && (
          <PlayerDashboard 
            playerData={playerData} 
            setCurrentPage={setCurrentPage}
            updateWallet={updateWallet}
            tournaments={TOURNAMENTS}
            leagues={LEAGUES}
          />
        )}

        {/* Admin Dashboard */}
        {currentPage === 'admin-dashboard' && adminStats && (
          <AdminDashboard 
            adminStats={adminStats}
            setCurrentPage={setCurrentPage}
            tournaments={TOURNAMENTS}
          />
        )}

        {/* Sponsor Portal */}
        {currentPage === 'sponsor-portal' && (
          <SponsorPortal setCurrentPage={setCurrentPage} />
        )}

        {/* Tournament Details */}
        {currentPage.startsWith('tournament-') && (
          <TournamentDetails 
            tournamentId={parseInt(currentPage.split('-')[1])}
            tournaments={TOURNAMENTS}
            setCurrentPage={setCurrentPage}
            playerData={playerData}
            updateWallet={updateWallet}
          />
        )}

        {/* League Details */}
        {currentPage.startsWith('league-') && (
          <LeagueDetails 
            leagueId={parseInt(currentPage.split('-')[1])}
            leagues={LEAGUES}
            setCurrentPage={setCurrentPage}
            playerData={playerData}
            updateWallet={updateWallet}
          />
        )}

        {/* KYC Page */}
        {currentPage === 'kyc-verify' && (
          <KYCVerification playerData={playerData} setCurrentPage={setCurrentPage} />
        )}

        {/* Wallet Page */}
        {currentPage === 'wallet' && playerData && (
          <WalletPage playerData={playerData} updateWallet={updateWallet} setCurrentPage={setCurrentPage} />
        )}
      </div>
    </div>
  );
};

// Login Page Component
const LoginPage = ({ handleLogin }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '2rem' }}>
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ef4444, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>Munene Esports Arena</h1>
      <p style={{ fontSize: '1.25rem', color: '#cbd5e1' }}>Compete. Win. Rise Through the Leagues.</p>
      <p style={{ color: '#94a3b8', marginTop: '1rem' }}>The ultimate eFootball tournament platform</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '800px' }}>
      <LoginCard 
        role="player" 
        title="Player Portal" 
        description="Join tournaments, compete for prizes, and climb the rankings"
        icon="🎮"
        handleLogin={handleLogin}
      />
      <LoginCard 
        role="admin" 
        title="Admin Dashboard" 
        description="Manage tournaments, users, payments, and platform analytics"
        icon="⚙️"
        handleLogin={handleLogin}
      />
      <LoginCard 
        role="sponsor" 
        title="Sponsor Portal" 
        description="Sponsor tournaments, track ROI, and manage advertisements"
        icon="🏆"
        handleLogin={handleLogin}
      />
    </div>

    <div style={{ marginTop: '3rem', padding: '2rem', background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', maxWidth: '600px', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1rem' }}>Platform Features</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
        <div>✅ Secure JWT Authentication</div>
        <div>✅ Real-time Tournament Updates</div>
        <div>✅ Multiple Payment Gateways</div>
        <div>✅ KYC Verification</div>
        <div>✅ Prize Pool Distribution</div>
        <div>✅ Ranking System</div>
        <div>✅ League Progression</div>
        <div>✅ Mobile Responsive</div>
      </div>
    </div>
  </div>
);

const LoginCard = ({ role, title, description, icon, handleLogin }) => (
  <div 
    onClick={() => handleLogin(role)}
    style={{ 
      padding: '2rem', 
      background: '#1e293b', 
      border: '2px solid #334155', 
      borderRadius: '0.75rem', 
      cursor: 'pointer',
      transition: 'all 0.3s',
      textAlign: 'center'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#ef4444';
      e.currentTarget.style.background = '#0f172a';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#334155';
      e.currentTarget.style.background = '#1e293b';
    }}
  >
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{title}</h3>
    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{description}</p>
    <button 
      onClick={(e) => { e.stopPropagation(); handleLogin(role); }}
      style={{ 
        marginTop: '1rem', 
        padding: '0.75rem 1.5rem', 
        background: 'linear-gradient(135deg, #ef4444, #f97316)', 
        color: 'white', 
        border: 'none', 
        borderRadius: '0.375rem', 
        cursor: 'pointer',
        fontWeight: '500'
      }}
    >
      Login
    </button>
  </div>
);

// Player Dashboard Component
const PlayerDashboard = ({ playerData, setCurrentPage, updateWallet, tournaments, leagues }) => {
  const walletTrend = [
    { month: 'Jan', balance: 800 },
    { month: 'Feb', balance: 1200 },
    { month: 'Mar', balance: 1500 },
    { month: 'Apr', balance: 2000 },
    { month: 'May', balance: 2200 },
    { month: 'Jun', balance: 2500 }
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard label="Wallet Balance" value={`KES ${playerData.wallet.toLocaleString()}`} icon="💰" />
        <StatCard label="Current Rank" value={playerData.rank.toLocaleString()} icon="🏅" />
        <StatCard label="Total Winnings" value={`KES ${playerData.winnings.toLocaleString()}`} icon="🎯" />
        <StatCard label="Tournaments Joined" value={playerData.tournaments_joined} icon="🎮" />
      </div>

      {playerData.kycStatus !== 'approved' && (
        <div style={{ background: '#7c2d12', border: '1px solid #ea580c', borderRadius: '0.5rem', padding: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>⚠️ KYC Verification Required</p>
            <p style={{ fontSize: '0.875rem', color: '#fed7aa' }}>Complete your identity verification to withdraw winnings</p>
          </div>
          <button 
            onClick={() => setCurrentPage('kyc-verify')}
            style={{ padding: '0.5rem 1rem', background: '#ef4444', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: 'white', fontWeight: '500' }}
          >
            Verify Now
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Wallet Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={walletTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="balance" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ActionButton label="💳 Deposit Funds" onClick={() => setCurrentPage('wallet')} />
            <ActionButton label="🏆 Browse Tournaments" onClick={() => setCurrentPage('tournaments')} />
            <ActionButton label="📊 Join a League" onClick={() => setCurrentPage('leagues')} />
            <ActionButton label="📋 My Matches" onClick={() => setCurrentPage('matches')} />
            <ActionButton label="🎖️ Achievements" onClick={() => setCurrentPage('achievements')} />
          </div>
        </div>
      </div>

      <TournamentBrowser tournaments={tournaments} setCurrentPage={setCurrentPage} />
    </div>
  );
};

// Tournament Details Component
const TournamentDetails = ({ tournamentId, tournaments, setCurrentPage, playerData, updateWallet }) => {
  const tournament = tournaments.find(t => t.id === tournamentId);
  if (!tournament) return <div>Tournament not found</div>;

  const handleJoinTournament = () => {
    if (playerData.wallet >= tournament.entryFee) {
      updateWallet(-tournament.entryFee);
      alert(`✅ Successfully joined ${tournament.name}! Entry fee of KES ${tournament.entryFee} has been deducted.`);
      setCurrentPage('player-dashboard');
    } else {
      alert('❌ Insufficient funds. Please deposit more money.');
    }
  };

  const bracketStages = ['Registration', 'Group Stage', 'Round of 64', 'Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

  return (
    <div>
      <button onClick={() => setCurrentPage('player-dashboard')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: '#334155', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: '#f1f5f9' }}>← Back to Dashboard</button>
      
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{tournament.name}</h1>
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
              <InfoRow label="Type" value={tournament.type} />
              <InfoRow label="Entry Fee" value={`KES ${tournament.entryFee.toLocaleString()}`} />
              <InfoRow label="Prize Pool" value={`KES ${tournament.prize.toLocaleString()}`} />
              <InfoRow label="Current Stage" value={tournament.stage} />
              <InfoRow label="Players Joined" value={tournament.players} />
              <InfoRow label="Status" value={<span style={{ color: tournament.status === 'active' ? '#22c55e' : '#f59e0b' }}>{tournament.status.toUpperCase()}</span>} />
            </div>
            <button 
              onClick={handleJoinTournament}
              style={{ 
                padding: '1rem 2rem', 
                background: 'linear-gradient(135deg, #ef4444, #f97316)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '0.375rem', 
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                width: '100%'
              }}
            >
              Join Tournament - KES {tournament.entryFee}
            </button>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Tournament Bracket</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {bracketStages.map((stage, idx) => (
                <div key={idx} style={{ 
                  padding: '0.5rem', 
                  background: stage === tournament.stage ? '#ef4444' : '#1e293b', 
                  borderLeft: stage === tournament.stage ? '3px solid #fbbf24' : 'none',
                  paddingLeft: stage === tournament.stage ? '0.75rem' : '0.5rem'
                }}>
                  {stage}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Prize Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🥇 1st Place</span><span style={{ color: '#fbbf24' }}>40%</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🥈 2nd Place</span><span style={{ color: '#a8a29e' }}>30%</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🥉 3rd Place</span><span style={{ color: '#b45309' }}>20%</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}><span>Other Top 8</span><span style={{ color: '#22c55e' }}>10%</span></div>
          </div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Competition Format</h3>
          <div style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            <p><strong>Platform:</strong> eFootball (Konami)</p>
            <p><strong>Match Duration:</strong> 2 legs (2x45 min)</p>
            <p><strong>Regulations:</strong> Standard competitive rules</p>
            <p><strong>Verification:</strong> Screenshots required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// League Details Component
const LeagueDetails = ({ leagueId, leagues, setCurrentPage, playerData, updateWallet }) => {
  const league = leagues.find(l => l.id === leagueId);
  if (!league) return <div>League not found</div>;

  const handleJoinLeague = () => {
    if (playerData.wallet >= league.entryFee) {
      updateWallet(-league.entryFee);
      alert(`✅ Successfully joined ${league.name}! Entry fee of KES ${league.entryFee} has been deducted.`);
      setCurrentPage('player-dashboard');
    } else {
      alert('❌ Insufficient funds. Please deposit more money.');
    }
  };

  const leaderboard = [
    { rank: 1, player: 'EliteKing_99', points: 5420, wins: 28, losses: 2 },
    { rank: 2, player: 'ProShooter_88', points: 5100, wins: 26, losses: 4 },
    { rank: 3, player: 'ChampionX_77', points: 4850, wins: 24, losses: 6 },
    { rank: 4, player: 'VictoryHunter_66', points: 4550, wins: 22, losses: 8 },
    { rank: 5, player: 'GoalMaster_55', points: 4200, wins: 20, losses: 10 },
  ];

  return (
    <div>
      <button onClick={() => setCurrentPage('player-dashboard')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: '#334155', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: '#f1f5f9' }}>← Back to Dashboard</button>
      
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{league.name}</h1>
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
              <InfoRow label="League Tier" value={league.tier} />
              <InfoRow label="Entry Fee" value={`KES ${league.entryFee.toLocaleString()}`} />
              <InfoRow label="Current Members" value={league.members} />
              <InfoRow label="Minimum Rank Required" value={league.minRank.toLocaleString()} />
              <InfoRow label="Season Duration" value="3 Months" />
              <InfoRow label="Promotion/Relegation" value="Top 5 → Promotion | Bottom 5 → Relegation" />
            </div>
            <button 
              onClick={handleJoinLeague}
              style={{ 
                padding: '1rem 2rem', 
                background: 'linear-gradient(135deg, #10b981, #14b8a6)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '0.375rem', 
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                width: '100%'
              }}
            >
              Join League - KES {league.entryFee}
            </button>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
              {league.tier === 'Bronze' && '🥉'}
              {league.tier === 'Silver' && '🥈'}
              {league.tier === 'Gold' && '🥇'}
              {league.tier === 'Platinum' && '💎'}
              {league.tier === 'Champion' && '👑'}
            </div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem', fontWeight: '600' }}>{league.tier} Tier</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Elite competition for the best players</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Season Leaderboard</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #334155' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Rank</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Player</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Points</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Wins</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Losses</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.75rem', color: row.rank === 1 ? '#fbbf24' : row.rank === 2 ? '#a8a29e' : row.rank === 3 ? '#b45309' : '#cbd5e1' }}>#{row.rank}</td>
                  <td style={{ padding: '0.75rem' }}>{row.player}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: '#22c55e', fontWeight: '600' }}>{row.points}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{row.wins}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{row.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Season Rewards</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🥇 Champion</span><span style={{ color: '#fbbf24' }}>KES 50,000</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🥈 Runner-up</span><span style={{ color: '#a8a29e' }}>KES 30,000</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🥉 Third</span><span style={{ color: '#b45309' }}>KES 15,000</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}><span>Top 10</span><span style={{ color: '#22c55e' }}>KES 2,000 each</span></div>
          </div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Promotion/Relegation</h3>
          <div style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            <p><strong style={{ color: '#22c55e' }}>↑ Promote to next tier</strong><br/>Top 5 at season end</p>
            <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#ef4444' }}>↓ Demote to lower tier</strong><br/>Bottom 5 at season end</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wallet Page
const WalletPage = ({ playerData, updateWallet, setCurrentPage }) => {
  const [depositAmount, setDepositAmount] = useState('');

  const gateways = [
    { name: 'M-Pesa', icon: '📱', color: '#059669' },
    { name: 'Pesapal', icon: '🏦', color: '#0891b2' },
    { name: 'IntaSend', icon: '💳', color: '#7c3aed' },
  ];

  const handleDeposit = (gateway, amount) => {
    if (amount > 0) {
      updateWallet(parseFloat(amount));
      alert(`✅ Successfully deposited KES ${amount} via ${gateway}`);
      setDepositAmount('');
    }
  };

  const transactionHistory = [
    { id: 1, type: 'Deposit', amount: 1000, date: '2026-06-20', status: 'Completed', gateway: 'M-Pesa' },
    { id: 2, type: 'Tournament Entry', amount: -500, date: '2026-06-18', status: 'Completed', tournament: 'Premier Cup' },
    { id: 3, type: 'Prize Payout', amount: 2500, date: '2026-06-15', status: 'Completed', from: 'Bronze League' },
    { id: 4, type: 'Withdrawal', amount: -1000, date: '2026-06-10', status: 'Pending', method: 'M-Pesa' },
  ];

  return (
    <div>
      <button onClick={() => setCurrentPage('player-dashboard')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: '#334155', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: '#f1f5f9' }}>← Back to Dashboard</button>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Current Balance</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>KES {playerData.wallet.toLocaleString()}</p>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Available for Withdrawal</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>KES {playerData.wallet.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: '600' }}>Deposit Funds</h3>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>Amount (KES)</label>
            <input 
              type="number" 
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                background: '#0f172a', 
                border: '1px solid #334155', 
                borderRadius: '0.375rem', 
                color: '#f1f5f9',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {gateways.map((gateway, idx) => (
            <button 
              key={idx}
              onClick={() => handleDeposit(gateway.name, depositAmount)}
              style={{ 
                padding: '1rem', 
                background: gateway.color, 
                color: 'white', 
                border: 'none', 
                borderRadius: '0.375rem', 
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              {gateway.icon} {gateway.name}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.75rem', color: '#94a3b8', backgroundColor: '#0f172a', padding: '1rem', borderRadius: '0.375rem' }}>
          💡 Secure Payment: All transactions are encrypted with SSL/TLS. Processing time: 1-5 minutes
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Transaction History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #334155' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Type</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Date</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((tx, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.75rem' }}>{tx.type}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: tx.amount > 0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{tx.amount > 0 ? '+' : ''}KES {Math.abs(tx.amount)}</td>
                  <td style={{ padding: '0.75rem', color: '#94a3b8', fontSize: '0.875rem' }}>{tx.date}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem',
                      background: tx.status === 'Completed' ? '#064e3b' : '#7c2d12',
                      color: tx.status === 'Completed' ? '#86efac' : '#fed7aa'
                    }}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// KYC Verification Component
const KYCVerification = ({ playerData, setCurrentPage }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    idType: 'national-id',
    idNumber: '',
    fullName: '',
    phone: '',
    email: playerData?.email || ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      alert('✅ KYC Verification submitted successfully! Processing may take 24-48 hours.');
      setCurrentPage('player-dashboard');
    }
  };

  return (
    <div>
      <button onClick={() => setCurrentPage('player-dashboard')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: '#334155', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: '#f1f5f9' }}>← Back to Dashboard</button>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>KYC Verification</h2>

          {/* Progress indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            {[1, 2, 3].map(s => (
              <div 
                key={s}
                style={{ 
                  width: '32%', 
                  height: '8px', 
                  background: s <= step ? '#ef4444' : '#334155',
                  borderRadius: '9999px'
                }}
              />
            ))}
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Step 1: Identity Verification</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>Provide your identity information</p>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>ID Type</label>
                <select 
                  value={formData.idType}
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: '#0f172a', 
                    border: '1px solid #334155', 
                    borderRadius: '0.375rem', 
                    color: '#f1f5f9',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="national-id">National ID</option>
                  <option value="passport">Passport</option>
                  <option value="driving-license">Driving License</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>ID Number</label>
                <input 
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  placeholder="Enter your ID number"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: '#0f172a', 
                    border: '1px solid #334155', 
                    borderRadius: '0.375rem', 
                    color: '#f1f5f9',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>Full Name</label>
                <input 
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Your full name"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: '#0f172a', 
                    border: '1px solid #334155', 
                    borderRadius: '0.375rem', 
                    color: '#f1f5f9',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Step 2: Contact Verification</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>Verify your contact details</p>
              
              <div style={{ background: '#0f172a', border: '2px dashed #334155', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                <p style={{ color: '#cbd5e1' }}>Upload or capture your selfie</p>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>For KYC verification</p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>Phone Number</label>
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+254..."
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: '#0f172a', 
                    border: '1px solid #334155', 
                    borderRadius: '0.375rem', 
                    color: '#f1f5f9',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ background: '#064e3b', border: '1px solid #059669', borderRadius: '0.375rem', padding: '0.75rem', fontSize: '0.875rem' }}>
                ✅ Email verified: {formData.email}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Step 3: Confirmation</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>Review your information</p>
              
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>ID Type:</span>
                  <span>{formData.idType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
                  <span style={{ color: '#94a3b8' }}>Full Name:</span>
                  <span>{formData.fullName || 'Pending'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Phone:</span>
                  <span>{formData.phone || 'Pending'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Email:</span>
                  <span>{formData.email}</span>
                </div>
              </div>

              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
                <input type="checkbox" style={{ marginTop: '0.25rem' }} />
                <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>I confirm that all information provided is accurate and authentic. I understand that providing false information may result in account suspension.</span>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                style={{ 
                  flex: 1, 
                  padding: '0.75rem', 
                  background: '#334155', 
                  border: 'none', 
                  borderRadius: '0.375rem', 
                  cursor: 'pointer',
                  color: '#f1f5f9',
                  fontWeight: '600'
                }}
              >
                Previous
              </button>
            )}
            <button 
              onClick={handleSubmit}
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                background: 'linear-gradient(135deg, #ef4444, #f97316)', 
                border: 'none', 
                borderRadius: '0.375rem', 
                cursor: 'pointer',
                color: 'white',
                fontWeight: '600'
              }}
            >
              {step === 3 ? 'Submit Verification' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ adminStats, setCurrentPage, tournaments }) => {
  const revenueData = [
    { month: 'January', revenue: 18000, users: 340 },
    { month: 'February', revenue: 22000, users: 380 },
    { month: 'March', revenue: 19000, users: 420 },
    { month: 'April', revenue: 25000, users: 520 },
    { month: 'May', revenue: 27000, users: 670 },
    { month: 'June', revenue: 28500, users: 780 },
  ];

  const revenueBreakdown = [
    { name: 'Tournament Fees', value: 45 },
    { name: 'Commissions', value: 30 },
    { name: 'Premium Members', value: 15 },
    { name: 'Sponsorships', value: 10 }
  ];

  const COLORS = ['#ef4444', '#f97316', '#fbbf24', '#22c55e'];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard label="Total Users" value={adminStats.totalUsers.toLocaleString()} icon="👥" />
        <StatCard label="Total Revenue" value={`KES ${adminStats.totalRevenue.toLocaleString()}`} icon="💰" />
        <StatCard label="Active Tournaments" value={adminStats.activeTourn} icon="🎮" />
        <StatCard label="Pending Withdrawals" value={adminStats.pendingWithdrawals} icon="⏳" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={revenueBreakdown} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <AdminActionButton label="📋 Manage Tournaments" />
            <AdminActionButton label="👥 Manage Users" />
            <AdminActionButton label="💳 Process Withdrawals" />
            <AdminActionButton label="🔍 Verify KYC" />
            <AdminActionButton label="📊 View Reports" />
          </div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <StatusItem label="Database" status="Online" />
            <StatusItem label="Payment Gateway" status="Online" />
            <StatusItem label="Storage Service" status="Online" />
            <StatusItem label="Email Service" status="Online" />
            <div style={{ borderTop: '1px solid #334155', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
              <p style={{ color: '#cbd5e1', margin: 0 }}>↑ Uptime: 99.98%</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Active Tournaments</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #334155' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Tournament</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Players</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Prize Pool</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.slice(0, 5).map((t, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.75rem' }}>{t.name}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{t.players}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: '#22c55e', fontWeight: '600' }}>KES {t.prize.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', background: t.status === 'active' ? '#064e3b' : '#7c2d12', color: t.status === 'active' ? '#86efac' : '#fed7aa' }}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sponsor Portal Component
const SponsorPortal = ({ setCurrentPage }) => {
  const sponsoredTournaments = [
    { id: 1, name: 'Tech Giants Cup', budget: 50000, spent: 35000, roi: 250, engagement: 8500 },
    { id: 2, name: 'FX Pro Championship', budget: 75000, spent: 65000, roi: 380, engagement: 12000 },
  ];

  return (
    <div>
      <button onClick={() => setCurrentPage('login')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: '#334155', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: '#f1f5f9' }}>← Logout</button>
      
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Sponsor Portal</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard label="Active Sponsorships" value="2" icon="🏆" />
        <StatCard label="Total Budget" value="KES 125,000" icon="💰" />
        <StatCard label="Avg ROI" value="315%" icon="📈" />
        <StatCard label="Total Engagement" value="20,500" icon="👥" />
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Sponsored Tournaments</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {sponsoredTournaments.map((t, idx) => (
            <div key={idx} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>{t.name}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Budget</span>
                  <span style={{ color: '#22c55e' }}>KES {t.budget.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Spent</span>
                  <span>KES {t.spent.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
                  <span style={{ color: '#94a3b8' }}>ROI</span>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{t.roi}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Engagement</span>
                  <span style={{ color: '#10b981' }}>{t.engagement.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Create New Sponsorship</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>Tournament Name</label>
            <select style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', color: '#f1f5f9', boxSizing: 'border-box' }}>
              <option>Select tournament...</option>
              <option>Weekend Warriors Cup</option>
              <option>Prime League Finals</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>Sponsorship Amount (KES)</label>
            <input type="number" placeholder="50000" style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', color: '#f1f5f9', boxSizing: 'border-box' }} />
          </div>
          <button style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: 'white', fontWeight: '600' }}>Create Sponsorship</button>
        </div>
      </div>
    </div>
  );
};

// Tournament Browser Component
const TournamentBrowser = ({ tournaments, setCurrentPage }) => (
  <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
    <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Available Tournaments</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
      {tournaments.map(t => (
        <div 
          key={t.id}
          onClick={() => setCurrentPage(`tournament-${t.id}`)}
          style={{ 
            background: '#0f172a', 
            border: '1px solid #334155', 
            borderRadius: '0.5rem', 
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.background = '#1e293b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#334155';
            e.currentTarget.style.background = '#0f172a';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>{t.name}</h4>
            <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.65rem', background: t.status === 'active' ? '#065f46' : '#92400e', color: t.status === 'active' ? '#86efac' : '#fcd34d' }}>
              {t.status}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1rem' }}>
            <div>🎮 {t.players} Players</div>
            <div>💰 KES {t.prize.toLocaleString()}</div>
            <div>📍 {t.stage}</div>
          </div>
          <div style={{ padding: '0.5rem', background: '#334155', borderRadius: '0.375rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
            Entry: KES {t.entryFee} →
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Helper Components
const StatCard = ({ label, value, icon }) => (
  <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 0.5rem' }}>{label}</p>
    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#f1f5f9' }}>{value}</p>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      padding: '0.75rem', 
      background: '#0f172a', 
      border: '1px solid #334155', 
      borderRadius: '0.375rem', 
      cursor: 'pointer', 
      color: '#f1f5f9',
      textAlign: 'left',
      fontSize: '0.9rem',
      transition: 'all 0.3s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#ef4444';
      e.currentTarget.style.background = '#1e293b';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#334155';
      e.currentTarget.style.background = '#0f172a';
    }}
  >
    {label}
  </button>
);

const AdminActionButton = ({ label }) => (
  <button style={{ padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', cursor: 'pointer', color: '#cbd5e1', textAlign: 'left', fontSize: '0.9rem' }}>
    {label}
  </button>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
    <span style={{ color: '#94a3b8' }}>{label}</span>
    <span style={{ fontWeight: '500' }}>{value}</span>
  </div>
);

const StatusItem = ({ label, status }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span style={{ color: '#94a3b8' }}>{label}</span>
    <span style={{ color: '#22c55e' }}>● {status}</span>
  </div>
);

export default MuneneEsportsArena;
