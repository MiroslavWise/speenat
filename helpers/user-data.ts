import jwt from 'jwt-simple';
import type { IUserData } from "types/user-data"

import { login as ApiLogin, verifyToken, refreshToken } from "api/api-auth"

const prefix = 'AuthJWT';
const isLogging = 'isLogging';
const userObjMap = ['RefreshToken', 'Token', 'Expiration', isLogging];

export default {
        async login({ email = "", password = "", curRefreshToken = "", isRefresh = false }) {
                try {
                        const data = isRefresh ? await refreshToken(curRefreshToken) : await ApiLogin({ email: email, password: password })
                        const { access, refresh } = data

                        const jwtData = jwt.decode(access, '', true)
                        sessionStorage.setItem(`${prefix}.Token`, access)
                        sessionStorage.setItem(`${prefix}.RefreshToken`, refresh)
                        sessionStorage.setItem(`${prefix}.Expiration`, jwtData.exp)

                        return {
                                access: true,
                                error: null,
                        }
                } catch (e) {
                        console.error("ERROR LOGIN OR REFETCH: ", e)
                        return {
                                access: false,
                                error: e
                        }
                } finally {
                        this.finisLogin()
                }
        },
        startLogin() {
                sessionStorage.setItem(isLogging, 'true');
        },
        finisLogin() {
                sessionStorage.removeItem(isLogging);
        },
        get isLogging() {
                return !!sessionStorage.getItem('isLogging');
        },
        delete() {
                userObjMap.forEach(key => sessionStorage.removeItem(`${prefix}.${key}`));
        },
        signOut() {
                document.dispatchEvent(new Event('signOutEvent'));
        },
        get JWT() {
                return sessionStorage.getItem(`${prefix}.Token`) || '';
        },
        get refreshToken() {
                return sessionStorage.getItem(`${prefix}.RefreshToken`) || '';
        },
        get tokenExp() {
                return sessionStorage.getItem(`${prefix}.Expiration`) || '';
        },
        get jwtData() {
                return this.JWT?.length ? jwt.decode(this.JWT, '', true) : {};
        },
        get isUserOk() {
                return userObjMap.some(item => sessionStorage.getItem(`${prefix}.${item}`) !== null);
        },
        async isTokenOk() {
                try {
                        this.startLogin();
                        await verifyToken(this.JWT);
                        return true;
                } catch (e) {
                        return false;
                } finally {
                        this.finisLogin();
                }
        },
} as IUserData