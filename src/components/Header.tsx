import { Settings, ChevronDown, Moon, Sun, Globe, HelpCircle, Sliders, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

interface HeaderProps {
  selectedBaby: string;
  onBabyChange: (value: string) => void;
  onSettingsClick: () => void;
  onLogout?: () => void;
}

export default function Header({ selectedBaby, onBabyChange, onSettingsClick, onLogout }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('ko');

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toast.info(isDarkMode ? 'Switched to Light Mode' : 'Switched to Dark Mode');
  };

  const handleLanguageToggle = () => {
    const newLang = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
    toast.info(newLang === 'ko' ? 'Switched to Korean' : 'Switched to English');
  };

  const handleCustomerService = () => {
    toast.info('Redirecting to Customer Service');
  };

  const handleSettings = () => {
    toast.info('Redirecting to Settings');
    onSettingsClick();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      toast.success('You have been logged out');
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 px-4 flex items-center justify-between bg-[#FFFDF9] border-b border-[#6AA6FF]/20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6AA6FF] to-[#9ADBC6] flex items-center justify-center">
          <span className="text-white">📖</span>
        </div>
        <h1 className="text-[#6AA6FF]">ToDoc 2.0</h1>
      </div>

      <Select value={selectedBaby} onValueChange={onBabyChange}>
        <SelectTrigger className="w-[140px] border-[#6AA6FF]/30 bg-white">
          <SelectValue placeholder="Select Baby" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">My Baby</SelectItem>
          <SelectItem value="2">First Child</SelectItem>
          <SelectItem value="3">Second Child</SelectItem>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#6AA6FF] hover:bg-[#6AA6FF]/10"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleDarkModeToggle}>
            {isDarkMode ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLanguageToggle}>
            <Globe className="h-4 w-4 mr-2" />
            {language === 'ko' ? 'English' : 'Korean'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCustomerService}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Support
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettings}>
            <Sliders className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}