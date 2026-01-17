import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-card animate-scale-in">
          <AuthForm onSuccess={() => navigate('/')} />
        </div>
      </div>
    </Layout>
  );
}
