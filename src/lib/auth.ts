import NextAuth, { type AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    accessToken?: string
    githubUsername?: string
    githubAvatar?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    githubUsername?: string
    githubAvatar?: string
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.githubUsername = (profile as any)?.login
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.githubAvatar = (profile as any)?.avatar_url
        console.log('JWT callback - profile:', profile)
        console.log('JWT callback - account:', account)
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.githubUsername = token.githubUsername
      session.githubAvatar = token.githubAvatar
      console.log('Session callback - session:', session)
      console.log('Session callback - token:', token)
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: true,
}

export default NextAuth(authOptions)
