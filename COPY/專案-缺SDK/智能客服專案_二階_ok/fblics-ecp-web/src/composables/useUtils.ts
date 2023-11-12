import { ref } from 'vue'
import rangMp3 from '@audio/rang.mp3'
export const useUtils = () => {
  // 後台 功能性頁面 bgicon 是
  const bgClass = (bgName: unknown): string => {
    return bgName ? `${bgName} pb-[130px]` : 'pb-[10px]'
  }

  // 換算時間 (上午、下午)
  const getTime = date => {
    const myDate = new Date(date)
    const hours = myDate.getHours() % 12 || 12
    const pmam = myDate.getHours() < 12 ? '上午' : '下午'
    const minutes = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()
    const time = pmam + ' ' + hours + ':' + minutes
    return time
  }

  let au: HTMLAudioElement = document.createElement('audio')

  // 創建 音效
  const createAudio = () => {
    const body = document.body
    au = document.createElement('audio')
    au.src = new URL(rangMp3, import.meta.url).href
    au.autoplay = false
    au.id = 'audioSnowt'
    au.loop = false
    body.appendChild(au)
  }

  // 播放 音效
  const playAudio = () => {
    if (!au.src) createAudio()
    au.currentTime = 0
    au.play()
  }

  return {
    bgClass,
    getTime,

    createAudio,
    playAudio,
  }
}
