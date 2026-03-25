import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  AlertCircle, Info, User, Shield, Users, 
  ChevronLeft, Building2, Eye, LayoutDashboard 
} from 'lucide-react';

// UI Components (Assuming these are your Shadcn paths)
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth, type Department } from '../context/AuthContext';

// Assets
const new_bg = "/landing-bg.jpg"; 
const logo_balintawak = "/logo-balintawak.png"; // Placeholder: replace with your local file later
const logo_nulipa = "/logo-nulipa.png"; // Placeholder: replace with your local file later
const logo_sits = "/logo-sits.png";
const logo_basis = "/logo-basis.png";

type Stage = 'initial' | 'selection' | 'committee' | 'login' | 'info';
type RoleSelection = 'secretary' | 'captain' | 'department' | null;

export default function LandingPage() {
  const [stage, setStage] = useState<Stage>('initial');
  const [selectedRole, setSelectedRole] = useState<RoleSelection>(null);
  const [selectedCommittee, setSelectedCommittee] = useState<Department | null>(null);
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const committees: Department[] = [
    'Health', 'Education', 'Justice', 'Appropriation',
    'Peace and Order', 'Sports', 'Agriculture', 'Infrastructure'
  ];

  // 1. Fix: Use useEffect for redirects to avoid "render-phase" navigation errors
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // 2. Debugged Navigation Handlers
  const handleRoleSelection = (role: RoleSelection) => {
    setSelectedRole(role);
    setError('');
    setLoginForm({ username: '', password: '' });
    
    if (role === 'department') {
      setStage('committee'); // Go to committee selection first
    } else {
      setStage('login'); // Go straight to login for Captain/Secretary
    }
  };

  const handleCommitteeSelection = (committee: Department) => {
    setSelectedCommittee(committee);
    setStage('login');
  };

  const handleBack = () => {
    setError('');
    if (stage === 'login') {
      if (selectedRole === 'department') {
        setStage('committee');
        setSelectedCommittee(null);
      } else {
        setStage('selection');
        setSelectedRole(null);
      }
    } else if (stage === 'committee') {
      setStage('selection');
      setSelectedRole(null);
    } else {
      setStage('initial');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(loginForm.username, loginForm.password);
    if (!success) setError('Invalid username or password');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 font-sans selection:bg-emerald-500/30">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img src={new_bg} alt="Background" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90" />
      </div>

      {/* Header Logos */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 w-full z-20 py-8 flex justify-center gap-6 md:gap-12 px-4"
      >
        {[logo_balintawak, logo_nulipa, logo_sits].map((logo, i) => (
          <img key={i} src={logo} className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full border border-white/10" />
        ))}
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 pt-24">
        <AnimatePresence mode="wait">
          {/* STAGE: INITIAL */}
          {stage === 'initial' && (
            <motion.div key="initial" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="text-center max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">B.A.S.I.S.</h1>
              <p className="text-xl text-slate-300 font-light mb-2">Balintawak Automated Storage and Inventory System</p>
              <p className="text-emerald-400 font-mono tracking-widest text-sm mb-12 uppercase">Digital Resource Management</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setStage('selection')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-7 text-xl rounded-2xl shadow-xl shadow-emerald-900/20 transition-all">
                  ENTER PORTAL
                </Button>
                <Button variant="ghost" onClick={() => setStage('info')} className="text-slate-400 hover:text-emerald-400 py-7 px-8">
                  <Info className="mr-2 h-5 w-5" /> SYSTEM INFO
                </Button>
              </div>
            </motion.div>
          )}

          {/* STAGE: ROLE SELECTION */}
          {stage === 'selection' && (
            <motion.div key="selection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md">
              <div className="bg-slate-800/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Identity Access</h2>
                <div className="space-y-4">
                  <RoleButton icon={<User />} label="Barangay Captain" onClick={() => handleRoleSelection('captain')} />
                  <RoleButton icon={<Shield />} label="Secretary" onClick={() => handleRoleSelection('secretary')} />
                  <RoleButton icon={<Users />} label="Department Head" onClick={() => handleRoleSelection('department')} />
                </div>
                <button onClick={handleBack} className="mt-8 w-full text-slate-500 hover:text-white transition-colors text-sm">← Return to Home</button>
              </div>
            </motion.div>
          )}

          {/* STAGE: COMMITTEE SELECTION */}
          {stage === 'committee' && (
            <motion.div key="committee" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-lg">
              <div className="bg-slate-800/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <h2 className="text-2xl font-bold text-white mb-6 sticky top-0 bg-slate-800/10 py-2 backdrop-blur-md">Select Department</h2>
                <div className="grid grid-cols-1 gap-3">
                  {committees.map((c) => (
                    <Button key={c} onClick={() => handleCommitteeSelection(c)} variant="secondary" className="justify-start py-6 bg-slate-700/40 hover:bg-emerald-600 hover:text-white border-none">
                      <Building2 className="mr-3 h-5 w-5" /> {c}
                    </Button>
                  ))}
                </div>
                <Button variant="link" onClick={handleBack} className="w-full mt-6 text-slate-400">Back to Roles</Button>
              </div>
            </motion.div>
          )}

          {/* STAGE: LOGIN */}
          {stage === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
              <div className="bg-slate-800/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4">
                    {selectedRole === 'captain' ? <User size={32} /> : selectedRole === 'secretary' ? <Shield size={32} /> : <Users size={32} />}
                  </div>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                    {selectedCommittee || selectedRole} Login
                  </h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-slate-400 ml-1">Username</Label>
                    <Input 
                      className="bg-slate-900/50 border-white/10 h-12 text-white focus:ring-emerald-500" 
                      value={loginForm.username} 
                      onChange={e => setLoginForm({...loginForm, username: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 ml-1">Password</Label>
                    <Input 
                      type="password" 
                      className="bg-slate-900/50 border-white/10 h-12 text-white focus:ring-emerald-500" 
                      value={loginForm.password} 
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
                      required 
                    />
                  </div>

                  {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center">{error}</motion.div>}

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleBack} className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">Back</Button>
                    <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">Sign In</Button>
                  </div>
                </form>

                {/* Demo Credentials Tip */}
                <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Demo Credentials</p>
                   <p className="text-xs text-emerald-400/80 font-mono">
                    {selectedRole === 'captain' && 'captain / captain2024'}
                    {selectedRole === 'secretary' && 'secretary / secretary2024'}
                    {selectedCommittee && `${selectedCommittee.toLowerCase().replace(' ', '_')}_head / ${selectedCommittee.toLowerCase().split(' ')[0]}2024`}
                   </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE: INFO */}
          {stage === 'info' && (
            <motion.div key="info" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full">
              <div className="bg-slate-800/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[85vh]">
                <div className="flex flex-col items-center text-center mb-10">
                  <img src={logo_basis} className="w-24 h-24 mb-6 drop-shadow-2xl" alt="BASIS" />
                  <h2 className="text-4xl font-bold text-white mb-2">Project B.A.S.I.S.</h2>
                  <p className="text-emerald-400 font-medium">Modernizing Barangay Logistics</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 text-slate-300">
                  <section>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2"><LayoutDashboard className="text-emerald-400" size={18}/> Background</h3>
                    <p className="text-sm leading-relaxed">Transitioning from manual, error-prone record-keeping to a centralized digital hub. Project B.A.S.I.S. ensures every piece of equipment and every supply is accounted for in real-time.</p>
                  </section>
                  <section>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2"><AlertCircle className="text-emerald-400" size={18}/> The Problem</h3>
                    <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20">
                      <p className="text-2xl font-bold text-emerald-400">31.8%</p>
                      <p className="text-xs">Reported delays in community service due to manual inventory tracking bottlenecks.</p>
                    </div>
                  </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
                  <Button onClick={() => setStage('selection')} className="bg-emerald-600 hover:bg-emerald-500 px-10 rounded-full h-14">Get Started</Button>
                  <button onClick={handleBack} className="mt-4 text-slate-500 text-sm hover:text-white">Back to Home</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Reusable Role Button Component
function RoleButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Button 
      onClick={onClick}
      className="w-full h-16 bg-slate-700/30 hover:bg-emerald-600/20 border border-white/5 hover:border-emerald-500/50 text-white rounded-2xl transition-all group flex justify-start px-6"
    >
      <span className="p-2 rounded-lg bg-slate-800 group-hover:bg-emerald-500 transition-colors mr-4">{icon}</span>
      <span className="text-lg font-medium">{label}</span>
    </Button>
  );
}