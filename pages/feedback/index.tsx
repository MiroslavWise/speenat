import { useContext, useState, useEffect } from "react"
import { shallow } from "zustand/shallow"

import { CreateJanusContext } from "context/ContextJanus"

import { useUser } from "store/use-user"
import { apiSpeakerReview, apiToSpeakerFeedback } from "api/api-review"
import { updateStatus } from "api/api-status"
import { useRouter } from "next/router"
import { Button, Input, Rate, Row, Space } from "antd"

const Feedback = () => {
  const { push } = useRouter()
  const [text, setText] = useState("")
  const [rate, setRate] = useState(0)
  const { propsCall, setPropsCall } = useContext(CreateJanusContext) ?? {}

  const { user, isSpeaker } = useUser(state => ({
    isSpeaker: state.is_speaker,
    user: state.user,
  }), shallow)

  useEffect(() => {
    if (!propsCall) {
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
          setPropsCall(null)
          setTimeout(() => {
            location.reload()
          }, 250)
        })
    } else {
      push("/teachers")
      setTimeout(() => {
        location.reload()
      }, 250)
    }
  }

  const sendReview = () => {
    if (isSpeaker) {
      const data = {
        speaker: user?.profile?.profile_id,
        student: propsCall?.user_info?.profile_id,
        conference: propsCall?.call_info?.conf_id,
        text: text
      }
      apiSpeakerReview(data)
        .finally(() => {
          updateStatus("online")
            .finally(() => {
              push('/archive')
              //@ts-ignore
              setPropsCall(null)
              setTimeout(() => {
                location.reload()
              }, 250)
            })
        })
    } else {
      const data = {
        speaker: propsCall?.speaker_info?.profile_id,
        author: user?.profile?.profile_id,
        conference: propsCall?.call_info?.conf_id,
        rating: rate,
        text: text,
      }
      apiToSpeakerFeedback(data)
        .finally(() => {
          push('/teachers')
          //@ts-ignore
          setPropsCall(null)
          setTimeout(() => {
            location.reload()
          }, 250)
        })
    }

  }

  return (
    <div className="wrapper-profile show-animate">
      <div className="header-archive" />
      <div className="profile-content">
        {
          isSpeaker
            ? <h3>Рекомендации студенту {propsCall?.user_info?.full_name}</h3>
            : <h3>Оцените преподавателя {propsCall?.speaker_info?.full_name}</h3>
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
            placeholder={isSpeaker ? `Напишите рекомендацию студенту ${propsCall?.user_info?.full_name}` : "Отзыв"}
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
            <p>Отправить</p>
          </Button>
        </div>
        <div className="item-form w-100">
          <Button onClick={btnCancel} className="state-revers w-100"><p>Отменить</p></Button>
        </div>
      </div>
    </div>
  )
}

export default Feedback