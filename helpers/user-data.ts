import jwt from 'jwt-simple';
import type { IUserData } from "types/user-data"

import { login as ApiLogin, verifyToken, refreshToken } from "api/api-auth"

const prefix = 'AuthJWT';
const isLogging = 'isLogging';
const userObjMap = ['RefreshToken', 'Token', 'Expiration', isLogging];

export default {
        async login({ email = "", password = "", curRefreshToken = "", isRefresh = false }) {
                console.log("---login ---", {
                        email, password, curRefreshToken, isRefresh
                })
                try {
                        const data = isRefresh ? await refreshToken(curRefreshToken) : await ApiLogin({ email: email, password: password })
                        const { access, refresh } = data
                        localStorage
                        const jwtData = jwt.decode(access, '', true)
                        localStorage.setItem(`${prefix}.Token`, access)
                        localStorage.setItem(`${prefix}.RefreshToken`, refresh)
                        localStorage.setItem(`${prefix}.Expiration`, jwtData.exp)

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
                localStorage.setItem(isLogging, 'true');
        },
        finisLogin() {
                localStorage.removeItem(isLogging);
        },
        get isLogging() {
                return !!localStorage.getItem('isLogging');
        },
        delete() {
                userObjMap.forEach(key => localStorage.removeItem(`${prefix}.${key}`));
        },
        signOut() {
                document.dispatchEvent(new Event('signOutEvent'));
        },
        get JWT() {
                return localStorage.getItem(`${prefix}.Token`) || '';
        },
        get refreshToken() {
                return localStorage.getItem(`${prefix}.RefreshToken`) || '';
        },
        get tokenExp() {
                return localStorage.getItem(`${prefix}.Expiration`) || '';
        },
        get jwtData() {
                return this.JWT?.length ? jwt.decode(this.JWT, '', true) : {};
        },
        get isUserOk() {
                return userObjMap.some(item => localStorage.getItem(`${prefix}.${item}`) !== null);
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