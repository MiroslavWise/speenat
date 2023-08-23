import { axiosInstance } from "./api-general"

export const apiSpeakerReview = async (data: any): Promise<any> => {
  return axiosInstance.post(`/speaker/remark/add/`, data)
    .then(data => data?.data)
    .catch(e => console.error('ERROR REMARK ADD: ', e))

}

export const apiToSpeakerFeedback = async (data: any): Promise<any> => {
  return axiosInstance.post('/speaker/feedback/add/', data)
    .then(data => data?.data)
    .catch(e => console.error('ERROR TO DOCTOR FEEDBACK: ', e))
}

export const apiToConfInfo = async (value: string): Promise<any> => {
  return axiosInstance.get(`/conference/${value}`)
    .then(data => data?.data)
    .catch(e => console.error('ERROR TO DOCTOR FEEDBACK: ', e))
}