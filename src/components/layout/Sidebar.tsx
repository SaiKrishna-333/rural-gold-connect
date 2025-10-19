import { 
  Home, 
  PlusCircle, 
  FileText, 
  User, 
  CreditCard, 
  BarChart3, 
  Users, 
  Brain, 
  Settings,
  Sparkles
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: PlusCircle, label: 'Issue Loan', path: '/issue-loan' },
  { icon: FileText, label: 'All Loans', path: '/all-loans' },
  { icon: User, label: 'Borrower Loans', path: '/borrower-loans' },
  { icon: CreditCard, label: 'Repay Loan', path: '/repay-loan' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'Peer Connections', path: '/peer-connections' },
  { icon: Brain, label: 'AI Insights', path: '/ai-insights' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 glass-panel min-h-screen border-r border-glass-border p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-background" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-gold-gradient">RuralConnect</h1>
          <p className="text-xs text-muted-foreground">P2P Lending</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-gold/10 hover:text-gold group",
                isActive && "bg-gold/20 text-gold border border-gold/30"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
