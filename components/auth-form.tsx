// import Form from 'next/form';

// import { Input } from './ui/input';
// import { Label } from './ui/label';

// export function AuthForm({
//   action,
//   children,
//   defaultEmail = '',
// }: {
//   action: NonNullable<
//     string | ((formData: FormData) => void | Promise<void>) | undefined
//   >;
//   children: React.ReactNode;
//   defaultEmail?: string;
// }) {
//   return (
//     <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
//       <div className="flex flex-col gap-2">
//         <Label
//           htmlFor="email"
//           className="text-zinc-600 font-normal dark:text-zinc-400"
//         >
//           Email Address
//         </Label>

//         <Input
//           id="email"
//           name="email"
//           className="bg-muted text-md md:text-sm"
//           type="email"
//           placeholder="user@acme.com"
//           autoComplete="email"
//           required
//           autoFocus
//           defaultValue={defaultEmail}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label
//           htmlFor="password"
//           className="text-zinc-600 font-normal dark:text-zinc-400"
//         >
//           Password
//         </Label>

//         <Input
//           id="password"
//           name="password"
//           className="bg-muted text-md md:text-sm"
//           type="password"
//           required
//         />
//       </div>

//       {children}
//     </Form>
//   );
// }


import Form from 'next/form';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Database, Zap, Shield, Activity } from 'lucide-react';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getEmailValidation = () => {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const colors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-blue-400', 'text-green-400'];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const emailValidation = getEmailValidation();
  const passwordStrength = getPasswordStrength();

  return (
    <Form action={action} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-3">
        <Label
          htmlFor="email"
          className="text-slate-200 font-medium text-sm flex items-center space-x-2"
        >
          <Mail className="w-4 h-4 text-cyan-400" />
          <span>Laboratory Email Address</span>
        </Label>

        <div className="relative group">
          {/* Glowing background effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-0 transition-opacity duration-300 ${
            isEmailFocused ? 'opacity-20' : 'group-hover:opacity-10'
          }`}></div>
          
          <div className="relative">
            <Input
              id="email"
              name="email"
              className={`w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 text-lg pr-12 ${
                isEmailFocused ? 'bg-white/15' : 'group-hover:bg-white/12'
              }`}
              type="email"
              placeholder="researcher@aqualab.io"
              autoComplete="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
            />
            
            {/* Email validation indicator */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              {email && (
                <div className={`w-2 h-2 rounded-full ${
                  emailValidation ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
              )}
            </div>
          </div>
          
          {/* Email validation message */}
          {email && !emailValidation && (
            <p className="text-red-400 text-xs mt-1 flex items-center space-x-1">
              <span>•</span>
              <span>Please enter a valid email address</span>
            </p>
          )}
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-3">
        <Label
          htmlFor="password"
          className="text-slate-200 font-medium text-sm flex items-center space-x-2"
        >
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Security Passphrase</span>
        </Label>

        <div className="relative group">
          {/* Glowing background effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-0 transition-opacity duration-300 ${
            isPasswordFocused ? 'opacity-20' : 'group-hover:opacity-10'
          }`}></div>
          
          <div className="relative">
            <Input
              id="password"
              name="password"
              className={`w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 text-lg pr-12 ${
                isPasswordFocused ? 'bg-white/15' : 'group-hover:bg-white/12'
              }`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your secure passphrase"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            
            {/* Password visibility toggle */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-cyan-400 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Password Strength</span>
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength.strength === 1 ? 'bg-red-400' :
                    passwordStrength.strength === 2 ? 'bg-orange-400' :
                    passwordStrength.strength === 3 ? 'bg-yellow-400' :
                    passwordStrength.strength === 4 ? 'bg-blue-400' :
                    passwordStrength.strength === 5 ? 'bg-green-400' : 'bg-slate-700'
                  }`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Security Features */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium text-sm flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Security Status</span>
          </h4>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Secure</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Database className="w-3 h-3 text-cyan-400" />
            <span>Encrypted Connection</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Session Protected</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Multi-Factor Ready</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Lab-Grade Security</span>
          </div>
        </div>
      </div>

      {children}
    </Form>
  );
}