/**

* ---
* File: src/services/storage/secure-storage.ts
* ---
* Brika cross-platform authentication/session storage.
*
* Native:
* Uses Expo SecureStore.
*
* Web:
* Uses browser localStorage because Expo SecureStore's native API is not
* available in the web runtime.
*
* The public API remains identical across platforms so authentication services
* do not need to know which platform they are running on.
* ---

*/

import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**

* ---
* Web Storage Availability
* ---
*
* Accessing localStorage directly can fail in environments where the browser
* storage API is unavailable or restricted.
  */

function getWebStorage(): Storage | null {
    if (Platform.OS !== "web") {
        return null;
    }

    if (typeof window === "undefined") {
        return null;
    }

    try {
        return window.localStorage;
    } catch {
        return null;
    }

}

/**

* ---
* Secure Storage
* ---

*/

export const secureStorage = {
    /**
    * -------------------------------------------------------------------------
    * Set Item
    * -------------------------------------------------------------------------
    */

    async setItem(
        key: string,
        value: string,
    ): Promise<void> {
        if (Platform.OS === "web") {
            const storage = getWebStorage();

            if (!storage) {
                throw new Error(
                    "Web storage is unavailable.",
                );
            }

            storage.setItem(key, value);

            return;
        }

        await SecureStore.setItemAsync(
            key,
            value,
        );
    },

    /**
     * -------------------------------------------------------------------------
     * Get Item
     * -------------------------------------------------------------------------
     */

    async getItem(
        key: string,
    ): Promise<string | null> {
        if (Platform.OS === "web") {
            const storage = getWebStorage();

            if (!storage) {
                return null;
            }

            return storage.getItem(key);
        }

        return SecureStore.getItemAsync(key);
    },

    /**
     * -------------------------------------------------------------------------
     * Remove Item
     * -------------------------------------------------------------------------
     */

    async removeItem(
        key: string,
    ): Promise<void> {
        if (Platform.OS === "web") {
            const storage = getWebStorage();

            if (!storage) {
                return;
            }

            storage.removeItem(key);

            return;
        }

        await SecureStore.deleteItemAsync(key);
    },

    /**
     * -------------------------------------------------------------------------
     * Clear Items
     * -------------------------------------------------------------------------
     */

    async clear(
        keys: string[],
    ): Promise<void> {
        if (Platform.OS === "web") {
            const storage = getWebStorage();

            if (!storage) {
                return;
            }

            keys.forEach((key) => {
                storage.removeItem(key);
            });

            return;
        }

        await Promise.all(
            keys.map((key) =>
                SecureStore.deleteItemAsync(key),
            ),
        );
    },
};
