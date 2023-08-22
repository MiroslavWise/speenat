import moment from 'moment'

import type { IRefreshData } from "types/user-data"

import asyncPause from './asyncPause'
import userData from './user-data'

const refreshLS = 'AuthJWT.refreshStarted'

export default {
        async waitForRefreshToken(): Promise<boolean> {
                if (!localStorage.getItem(refreshLS)) {
                        if (userData.isUserOk) {
                                return true;
                        }
                        throw new Error("Can't refresh token.");
                }
                await asyncPause();
                return this.waitForRefreshToken();
        },
        async refresh() {
                if (!localStorage.getItem(refreshLS)) {
                        this.startRefresh();
                        try {
                                console.log(" login refresh : ", )
                                await userData.login({ curRefreshToken: userData.refreshToken, isRefresh: true })
                                        .then(response => {
                                                console.log('response: ', response)
                                        })
                                        .finally(() => {
                                                this.finishRefresh();
                                        })
                        } catch (e) {
                                userData.delete();
                                throw e;
                        }
                } else {
                        await this.waitForRefreshToken();
                }
        },
        startRefresh() {
                localStorage.setItem(refreshLS, 'true')
        },
        finishRefresh() {
                localStorage.removeItem(refreshLS)
        },
        get isNeedToRefresh() {
                return moment(userData.tokenExp).isBefore(moment().toISOString())
        },
        get isRefreshing() {
                return !!localStorage.getItem(refreshLS);
        },
} as IRefreshData