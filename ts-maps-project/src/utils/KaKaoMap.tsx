import React, { useState } from "react";

import {
  Map,
  MapMarker,
  Roadview,
  RoadviewMarker,
  ZoomControl,
  MapTypeControl,
  MapTypeId,
  MapInfoWindow,
} from "react-kakao-maps-sdk";

// KakaoMapProps: KakaoMap 컴포넌트가 받을 속성들의 타입 정의
interface KakaoMapProps {
  roadviewPosition: { lat: number; lng: number; radius: number } | null; // 로드뷰의 위치
  searchResults: any[]; // 검색 결과 배열
  isRoadviewVisible: boolean; // 로드뷰가 활성화 상태인지 여부
}

// KakaoMap 컴포넌트: 지도 및 로드뷰를 렌더링
export default function KakaoMap({
  roadviewPosition,
  searchResults,
  isRoadviewVisible,
}: KakaoMapProps) {
  // 인포윈도우 열림 상태를 관리하는 state
  const [openMarkerIndex, setOpenMarkerIndex] = useState<number | null>(null);

  return isRoadviewVisible && roadviewPosition ? ( // 로드뷰가 활성화 상태이면서 로드뷰의 위치가 존재하는 경우
    <Roadview
      position={roadviewPosition} // 로드뷰를 표시할 위치
      style={{ width: "100%", height: "900px" }} // 로드뷰의 스타일 (화면 전체)
    >
      <RoadviewMarker position={roadviewPosition} /> {/* 로드뷰에 마커 표시 */}
    </Roadview>
  ) : (
    // 로드뷰가 비활성화 상태인 경우 기본 지도를 렌더링
    <Map
      center={{ lat: 37.566826, lng: 126.9786567 }} // 초기 지도 중심 좌표 (서울 중심)
      style={{ width: "100%", height: "900px" }} // 지도 크기
      level={3} // 초기 줌 레벨 (숫자가 낮을수록 확대)
    >
      {/* 지도에 표시할 정보창 */}
      <MapInfoWindow
        position={{
          lat: 37.566826, // 인포 윈도우가 표시될 위도
          lng: 126.978656, // 인포 윈도우가 표시될 경도
        }}
        removable={true} // 닫기 버튼 활성화 -> removeable 속성을 true로 설정하면 인포 윈도우를 닫을 수 있는 x버튼이 활성화됨
      >
        <div style={{ padding: "5px", color: "#000" }}>Hello World!</div>{" "}
        {/* 정보창 내용 */}
      </MapInfoWindow>
      {/* 검색 결과로 받은 위치들에 마커 표시 */}
      {searchResults.map((result, index) => (
        <MapMarker
          key={index} // 고유 키
          position={{
            lat: parseFloat(result.y), // 검색 결과의 위도
            lng: parseFloat(result.x), // 검색 결과의 경도
          }}
          onMouseOver={() => setOpenMarkerIndex(index)} // 마우스 오버 시 상태 업뎃
          onMouseOut={() => setOpenMarkerIndex(null)} // 마우스 아웃 시 상태 초기화
        >
          {/* 마우스가 올려진 마커에만 인포윈도우를 표시 */}
          {openMarkerIndex === index && (
            <div style={{ padding: "5px", color: "#000", background: "#fff", border: "1px solid #ccc" }}>
              {/* 마커에 표시할 내용 (장소명) */}
              {result.place_name}
            </div>
          )}
        </MapMarker>
      ))}

      {/* 지도에 교통 정보를 표시하도록 지도 타입 추가 */}
      <MapTypeId type={"TRAFFIC"} />

      {/* 지도에 로드뷰 정보가 있는 도로를 표시하기 위해 지도 타입 추가 */}
      {/* <MapTypeId type={"ROADVIEW"} /> */}

      {/* 지도에 지형 정보를 표시 하도록 지도 타입 추가 */}
      <MapTypeId type={"TERRAIN"} />

      {/* 지도 확대 & 축소 컨트롤러 */}
      <ZoomControl position="RIGHT" /> {/* 우측 위치 */}

      {/* 지도 타입 전환 컨트롤러 */}
      <MapTypeControl position="TOPRIGHT" /> {/* 우측 상단 위치 */}
    </Map>
  );
}
