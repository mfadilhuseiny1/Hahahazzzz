'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Waves, Users, Shield, Zap, Database, Activity, ChevronRight, Building2, UserCheck, Globe } from 'lucide-react';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';

// Pre-generate static positions for nodes to ensure SSR/CSR consistency
const NODE_POSITIONS = [
  { id: 1, left: 15, top: 25, delay: 0, duration: 4 },
  { id: 2, left: 85, top: 15, delay: 1, duration: 3 },
  { id: 3, left: 70, top: 80, delay: 2, duration: 5 },
  { id: 4, left: 20, top: 70, delay: 0.5, duration: 4 },
  { id: 5, left: 50, top: 40, delay: 1.5, duration: 3.5 },
  { id: 6, left: 90, top: 60, delay: 2.5, duration: 4.5 },
  { id: 7, left: 30, top: 10, delay: 1, duration: 3 },
  { id: 8, left: 65, top: 30, delay: 2, duration: 5 },
  { id: 9, left: 10, top: 50, delay: 0.8, duration: 4 },
  { id: 10, left: 40, top: 90, delay: 1.8, duration: 3.8 },
  { id: 11, left: 75, top: 5, delay: 2.2, duration: 4.2 },
  { id: 12, left: 5, top: 95, delay: 0.3, duration: 3.3 },
  { id: 13, left: 60, top: 70, delay: 1.3, duration: 4.7 },
  { id: 14, left: 25, top: 35, delay: 2.7, duration: 3.7 },
  { id: 15, left: 80, top: 45, delay: 1.1, duration: 4.1 },
];

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast.error('Account already exists');
    } else if (state.status === 'failed') {
      toast.error('Failed to create account');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      toast.success('Account created successfully');
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  const accessLevels = [
    { name: 'Researcher', icon: Database, desc: 'Full system access', users: '12 Active' },
    { name: 'Technician', icon: Activity, desc: 'Monitoring & alerts', users: '8 Active' },
    { name: 'Observer', icon: Globe, desc: 'Read-only access', users: '24 Active' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_70%,_rgba(139,92,246,0.4),_transparent_60%)]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(59,130,246,0.4),_transparent_60%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_100%,_rgba(16,185,129,0.3),_transparent_60%)]"></div>
      </div>

      {/* Dynamic Mouse Follower */}
      <div 
        className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl transition-all duration-1000 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
      ></div>

      {/* Floating Network Nodes - Fixed positions for hydration consistency */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {NODE_POSITIONS.map((node) => (
          <div
            key={node.id}
            className="absolute w-3 h-3 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full animate-pulse"
            style={{
              left: `${node.left}%`,
              top: `${node.top}%`,
              animationDelay: `${node.delay}s`,
              animationDuration: `${node.duration}s`,
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 blur-sm opacity-60"></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 pb-20">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Lab Access Information */}
          <div className="space-y-8 text-white">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    AquaLab IoT Access
                  </h1>
                  <p className="text-purple-200 text-sm">Research Team Registration</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-4xl font-bold leading-tight">
                  Join Our
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Research Network
                  </span>
                </h2>
                <p className="text-xl text-slate-300 max-w-lg">
                  Get access to cutting-edge IoT aquaculture systems and contribute to marine science advancement.
                </p>
              </div>
            </div>

            {/* Access Levels */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Available Access Levels</h3>
              <div className="space-y-3">
                {accessLevels.map((level, index) => (
                  <div 
                    key={level.name}
                    className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <level.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{level.name}</h4>
                          <p className="text-sm text-slate-400">{level.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-cyan-400">{level.users}</p>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">44</div>
                <div className="text-sm text-slate-400">Active Users</div>
                <div className="h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">12</div>
                <div className="text-sm text-slate-400">Research Projects</div>
                <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-slate-400">System Uptime</div>
                <div className="h-1 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full"></div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Research Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300">Real-time data access across all laboratory systems</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span className="text-slate-300">Collaborative research tools and data sharing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span className="text-slate-300">Advanced analytics and ML-powered insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                  <span className="text-slate-300">24/7 technical support and system monitoring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mb-4">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Lab Access</h3>
                <p className="text-slate-300">
                  Join our research team and access advanced aquaculture systems
                </p>
              </div>

              {/* Registration Steps */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <span className="text-sm text-white">Account</span>
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-blue-500"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-slate-400 text-sm font-bold">
                    2
                  </div>
                  <span className="text-sm text-slate-400">Verification</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-slate-400 text-sm font-bold">
                    3
                  </div>
                  <span className="text-sm text-slate-400">Access</span>
                </div>
              </div>

              {/* Enhanced AuthForm */}
              <div className="space-y-6">
                <AuthForm action={handleSubmit} defaultEmail={email}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                          required
                        />
                      </div>
                      <div className="relative group">
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Research Email Address"
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Database className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    <div className="relative group">
                      <input
                        type="text"
                        name="institution"
                        placeholder="Institution / Organization"
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    <div className="relative group">
                      <select
                        name="accessLevel"
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                        required
                      >
                        <option value="" className="bg-slate-800 text-white">Select Access Level</option>
                        <option value="observer" className="bg-slate-800 text-white">Observer - Read-only access</option>
                        <option value="technician" className="bg-slate-800 text-white">Technician - Monitoring & alerts</option>
                        <option value="researcher" className="bg-slate-800 text-white">Researcher - Full system access</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Shield className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                   
                    <div className="relative group">
                      <input
                        type="password"
                        name="password"
                        placeholder="Secure Password"
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Zap className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    <div className="relative group">
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Shield className="w-5 h-5 text-slate-400" /> 
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <SubmitButton isSuccessful={isSuccessful}>
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <span>Submit Access Request</span>
                        <ChevronRight className="w-5 h-5" />
                      </span>
                    </SubmitButton>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                </AuthForm>

                {/* Enhanced Footer */}
                <div className="text-center space-y-4">
                  <p className="text-slate-400">
                    {"Already have laboratory access? "}
                    <Link
                      href="/login"
                      className="font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline"
                    >
                      Sign In Here
                    </Link>
                  </p>
                  
                  <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Instant Processing</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Secure Registration</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span>24h Approval</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      By submitting this request, you agree to our research collaboration terms and data usage policies. Access will be granted within 24 hours pending verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6 text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Registration: Open</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Approval: Automated</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Support: 24/7</span>
            </div>
          </div>
          <div className="text-slate-500">
            Research Network © 2025 Bluesand AI
          </div>
        </div>
      </div>
    </div>
  );
}