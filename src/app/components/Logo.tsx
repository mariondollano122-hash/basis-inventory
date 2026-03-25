const logo_balintawak = "/logo-balintawak.png";
const logo_nulipa = "/logo-nulipa.png";
const logo_sits = "/logo-sits.png";

import { Building2 } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
  showOfficialLogos?: boolean;
}

export function Logo({ size = 'md', showText = true, variant = 'light', showOfficialLogos = true }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', container: 'gap-2', logos: 'w-10 h-10' },
    md: { icon: 'w-10 h-10', text: 'text-xl', container: 'gap-3', logos: 'w-14 h-14' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', container: 'gap-3', logos: 'w-16 h-16' },
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const accentColor = variant === 'light' ? 'text-emerald-400' : 'text-emerald-600';

  return (
    <div className="flex items-center gap-6">
      {showOfficialLogos && (
        <div className="flex items-center gap-4">
<img 
  src={logo_balintawak} 
  alt="Barangay Balintawak" 
  className={`${sizes[size].logos} rounded-full object-cover`}
/>
          <img 
            src={logo_nulipa} 
            alt="NU Lipa" 
            className={`${sizes[size].logos} object-contain`}
          />
          <img 
            src={logo_sits} 
            alt="SITS" 
            className={`${sizes[size].logos} object-contain`}
          />
        </div>
      )}
      
      <div className={`inline-flex items-center ${sizes[size].container}`}>
        <div className="relative">
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-emerald-500/30 rounded-xl blur-lg animate-pulse" />
          
          {/* Logo container */}
          <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-900/50">
            <Building2 className={`${sizes[size].icon} text-white`} />
          </div>
        </div>
        
        {showText && (
          <div className="flex flex-col leading-tight">
            <span className={`${sizes[size].text} font-bold ${textColor} tracking-wide`}>
              B.A.S.I.S.
            </span>
            {size !== 'sm' && (
              <span className={`text-xs ${accentColor} font-medium`}>
                Inventory System
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}