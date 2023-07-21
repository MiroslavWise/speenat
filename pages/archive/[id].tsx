import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { shallow } from "zustand/shallow";

import Loader from "@loader-spin";

import { useDocumentTitle } from "hooks/useDocumentTitle";
import { conference } from "api/api-user";
import { useUser } from "store/use-user";
import loadImage from "functions/load-image";
import { srcImage } from "functions/src-image";
import { replaceHttps } from "functions/replace-https";
import dayjs from "dayjs";
import { statusCallConf } from "functions/status-conf";

export default function ArchiveCurrent() {
  const { query: { id } } = useRouter()
  useDocumentTitle("Архив")

  const { data, isLoading } = useQuery(['archive', id], () => conference(id))

  const { isSpeaker, loading, user } = useUser(state => ({
    isSpeaker: state.is_speaker,
    user: state.user,
    loading: state.loading,
  }), shallow)

  if (isLoading || loading) return <Loader />

  return (
    <div className="content-archive">
      <div className="header-archive" />
      <div className="list-archive">
        <Image
          loader={loadImage}
          src={srcImage((isSpeaker && data?.student_profile?.photo_url) ? replaceHttps(data?.student_profile?.photo_url) : data?.speaker?.profile?.photo_url ? replaceHttps(data?.speaker?.profile?.photo_url) : 'default')}
          alt="photo"
          height={250}
          width={500}
          style={{
            width: "100%",
            objectFit: "cover",
            borderRadius: 10,
          }}
          className="avatar"
        />
        <div className="descriptions-archive">
          <p>{isSpeaker ? "Студент: " : "Спикер: "} <span>{isSpeaker ? data?.student_profile?.full_name : data?.speaker?.profile?.full_name}</span></p>
          <p>Продолжительность сессии: <span>{data?.conference_time?.sessions_time?.replace("min", " минут")}</span></p>
          <p>Дата сессии: <span>{dayjs(data?.created_at).format("HH:mm DD.MM.YYYY")}</span></p>
          <p>Оплата: <span>{data?.conference_time?.price}₸</span></p>
          <p>Статус: <span style={{ color: statusCallConf(data?.status)?.color }}>{statusCallConf(data?.status).title}</span></p>
          {
            data?.record_url !== "not_found"
              ? <p>Видео: <a href={data?.record_url}>Скачать</a></p>
              : null
          }
        </div>
      </div>
    </div>
  )
}