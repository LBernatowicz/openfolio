import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    accessToken?: string
    githubUsername?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    githubUsername?: string
  }
}

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.githubUsername = profile?.login
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.githubUsername = token.githubUsername
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

export default NextAuth(authOptions)
