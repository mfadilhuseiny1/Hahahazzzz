import bcrypt from 'bcryptjs';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/lib/db/queries';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  debug: true,
  trustHost: true, 
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        console.log('🔐 Auth attempt for email:', email);
        console.log('🌍 Environment:', process.env.NODE_ENV);
        console.log('🔗 NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
        
        try {
          const users = await getUser(email);
          console.log('👥 Users found:', users.length);
          
          if (users.length === 0) {
            console.log('❌ No user found for email:', email);
            return null;
          }
          
          const user = users[0];
          console.log('👤 User ID:', user.id);
          console.log('🔒 Stored password hash exists:', !!user.password);
          
          if (!user.password) {
            console.log('❌ No password hash stored for user');
            return null;
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log('🔑 Password match result:', passwordsMatch);
          
          if (!passwordsMatch) {
            console.log('❌ Password mismatch for user:', email);
            return null;
          }
          
          console.log('✅ Authentication successful for:', email);
          return {
            id: user.id,
            email: user.email,
          } as any;
          
        } catch (error) {
          console.error('💥 Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('🎫 JWT callback - user:', !!user, 'token.id:', token.id);
      if (user) {
        token.id = user.id;
        console.log('🎫 Setting token.id to:', user.id);
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      console.log('📋 Session callback - token.id:', token.id);
      if (session.user) {
        session.user.id = token.id as string;
        console.log('📋 Session user ID set to:', session.user.id);
      }
      return session;
    },
  },
});
