import type { ReactNode } from 'react'
import StatusBar from './StatusBar'
import HomeIndicator from './HomeIndicator'
import { DEVICE_FRAME } from '../../config/app'
import './DeviceFrame.css'

interface DeviceFrameProps {
  children: ReactNode
  /** 브라우저 높이가 낮을 때 목업 전체를 비율에 맞춰 줄인다. */
  scale?: number
}

/**
 * PC에서만 쓰는 기기 외곽 목업.
 *
 * 내부 크기는 Figma 기준(402 × 874)을 유지한다. 콘텐츠가 길어져도 기기가 늘어나지 않는다.
 * 축소는 transform으로만 하고, 앱 내부의 기준 레이아웃 크기는 바꾸지 않는다. (PROJECT_SPEC.md §2)
 *
 * transform은 레이아웃 자리를 줄이지 않는다.
 * 그대로 두면 시각적으로 작아진 기기 아래에 빈 공간이 남고 페이지가 스크롤된다.
 * 그래서 바깥 래퍼에 축소된 크기만큼만 자리를 잡아 준다.
 *
 * 목업 장식은 클릭·터치·키보드 탐색을 방해하지 않는다.
 */
function DeviceFrame({ children, scale = 1 }: DeviceFrameProps) {
  return (
    <div
      className="device-frame-fit"
      style={{
        width: DEVICE_FRAME.width * scale,
        height: DEVICE_FRAME.height * scale,
      }}
    >
      <div className="device-frame-scaler" style={{ transform: `scale(${scale})` }}>
        <div className="device-frame">
          <div className="device-frame__bezel">
            <div className="device-frame__screen">
              <StatusBar />
              {children}
              <HomeIndicator />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeviceFrame
