
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveProfile = () => {
    // In a real app, you would update the user profile here
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
    setEditing(false);
  };

  const getInitials = () => {
    if (displayName) {
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return currentUser.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          className="max-w-4xl mx-auto bg-background rounded-xl shadow-lg border border-border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-primary/10 h-40 relative"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end -mt-16 mb-6">
              <Avatar className="h-32 w-32 border-4 border-background bg-primary">
                <AvatarImage src={currentUser.photoURL || undefined} alt="Profile" />
                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                {editing ? (
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Display Name"
                      className="max-w-xs"
                    />
                    <Button size="icon" variant="ghost" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditing(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">
                      {displayName || 'User'}
                    </h1>
                    <Button size="icon" variant="ghost" onClick={() => setEditing(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-center sm:justify-start text-muted-foreground gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{currentUser.email}</span>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Created</p>
                    <p>{currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Sign In</p>
                    <p>{currentUser.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Activity</h2>
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <User className="h-10 w-10 mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
