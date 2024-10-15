import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    plataform: 'com.rafael.aora',
    projectId: '670ea22d000dc7a27ce0',
    databaseId: '670ea31200207c980696',
    userCollectionId: '670ea32f003c7390afc7',
    videoCollectionId: '670ea36d0023277ce938',
    storageId: '670ea47c001aa5cb4d6b'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.plataform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username

        )
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession
        (email, password)

        return session
    } catch (error) {
        console.log("Aqui")
        throw new Error(error)
    }
}

export async function signOut() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()
        if(!currentAccount) throw Error


        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error

        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
    }
}

