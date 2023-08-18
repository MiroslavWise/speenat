import { useTranslation } from "react-i18next"
import { useContext, useState, useEffect } from "react"
import { shallow } from "zustand/shallow"

import { CreateJanusContext } from "context/ContextJanus"

import { useUser } from "store/use-user"
import { apiSpeakerReview, apiToSpeakerFeedback } from "api/api-review"
import { updateStatus } from "api/api-status"
import { useRouter } from "next/router"
import { Button, Input, Rate, Row, Space } from "antd"
import { usePropsCallingJanus } from "store/use-call-janus"

const Feedback = () => {
  const { t } = useTranslation()
  const { push } = useRouter()
  const [text, setText] = useState("")
  const [rate, setRate] = useState(0)
  const { deleteAll, call_info, speaker_info, user_info } = usePropsCallingJanus(state => ({
    call_info: state.call_info,
    speaker_info: state.speaker_info,
    user_info: state.user_info,
    deleteAll: state.deleteAll,
  }), shallow)

  const { user, isSpeaker } = useUser(state => ({
    isSpeaker: state.is_speaker,
    user: state.user,
  }), shallow)

  useEffect(() => {
    if (!call_info) {
      if (isSpeaker) {
        push('/archive')
      } else {
        push("/teachers")
      }
    }
  }, [])

  const btnCancel = () => {

    if (isSpeaker) {
      updateStatus("online")
        .finally(() => {
          push('/archive')
          //@ts-ignore
          deleteAll()
        })
    } else {
      push("/teachers")
    }
  }

  const sendReview = () => {
    if (isSpeaker) {
      const data = {
        speaker: user?.profile?.profile_id,
        student: user_info?.profile_id,
        conference: call_info?.conf_id,
        text: text
      }
      apiSpeakerReview(data)
        .finally(() => {
          updateStatus("online")
            .finally(() => {
              push('/archive')
              //@ts-ignore
              deleteAll()
            })
        })
    } else {
      const data = {
        speaker: speaker_info?.profile_id,
        author: user?.profile?.profile_id,
        conference: call_info?.conf_id,
        rating: rate,
        text: text,
      }
      apiToSpeakerFeedback(data)
        .finally(() => {
          push('/teachers')
          //@ts-ignore
          deleteAll()
        })
    }
  }

  useEffect(() => {
    return () => {
      deleteAll()
      setTimeout(() => {
        location.reload()
      }, 250)
    }
  }, [])

  return (
    <div className="wrapper-profile show-animate">
      <div className="profile-content" style={{ marginTop: isSpeaker ? 120 : 88 }}>
        {
          isSpeaker
            ? <h3>{t("Recommendations to the student")} {user_info?.full_name}</h3>
            : <h3>{t("Rate the teacher")} {speaker_info?.full_name}</h3>
        }
        {
          !isSpeaker
            ? (
              <Row className="w-100" style={{
                alignItems: "center",
                marginBottom: 10, marginTop: 10,
              }}>
                <p>Уровень обучения </p>
                <Rate
                  onChange={setRate}
                  value={rate}
                  style={{ color: 'red' }}
                />
              </Row>
            ) : null
        }
        <Row className="w-100">
          <Input.TextArea
            className="w-100"
            rows={4}
            minLength={10}
            placeholder={isSpeaker ? `${t("Write a recommendation to the student")} ${user_info?.full_name}` : t("feedback")!}
            onChange={(value) => { setText(value?.target?.value) }}
            value={text}
          />
        </Row>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 10,
            marginBottom: 10,
            gap: 10,
          }}
        >
        </div>
        <div className="item-form w-100">
          <Button
            className="login-submit w-100"
            onClick={sendReview}
            disabled={text.length < 5}
          >
            <p>{t("Send")}</p>
          </Button>
        </div>
        <div className="item-form w-100">
          <Button onClick={btnCancel} className="state-revers w-100"><p>{t("Cancel")}</p></Button>
        </div>
      </div>
    </div>
  )
}

export default Feedback