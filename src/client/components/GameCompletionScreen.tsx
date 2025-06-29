/**
 * 游戏结算界面组件 - 全新UI设计
 * 基于新的卡片式设计，展示游戏结果和统计数据
 * 游戏结算界面组件 - 全新UI设计
 * 基于新的卡片式设计，展示游戏结果和统计数据
 * 
 * @author 开发者B - UI/UX 界面负责人
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { LeaderboardRankingScreen } from './LeaderboardRankingScreen';
import { ImagePreviewModal } from './ImagePreviewModal';
import { SuccessToast } from './SuccessToast';
import { useResponsiveScale, useResponsiveSize } from '../hooks/useResponsiveScale';
import { 
  captureGameCompletionScreenshot, 
  downloadImage, 
  shareResultToClipboard
} from '../utils/shareUtils';

interface GameCompletionScreenProps {
  onPlayAgain: () => void;
  onBackToStart: () => void;
  gameStats: {
    enduranceDuration: number;
  };
  playerInfo: {
    playerName: string;
    continentId: string;
    catAvatarId: string;
  };
}

export const GameCompletionScreen: React.FC<GameCompletionScreenProps> = ({
  onPlayAgain,
  gameStats,
  playerInfo,
}) => {
  const [showRanking, setShowRanking] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 响应式设计hooks
  const { cssVars } = useResponsiveScale();
  const { scale } = useResponsiveSize();
  
  // 洲ID到图片映射
  const getContinentImage = (continentId: string): string => {
    const continentImages: { [key: string]: string } = {
      'NA': '/namerica.png',
      'SA': '/samerica.png', 
      'EU': '/europe.png',
      'AS': '/asia.png',
      'AF': '/africa.png',
      'OC': '/oceania.png'
    };
    return continentImages[continentId] || '/asia.png';
  };
  
  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cats: any[] = []; // Placeholder for cats, as generation logic is removed

  // 处理分享功能
  const handleShare = async () => {
    try {
      const gameData = {
        playerName: playerInfo.playerName,
        time: formatTime(gameStats.enduranceDuration),
      };
      
      const success = await shareResultToClipboard(gameData);
      if (success) {
        setSuccessMessage('分享文本已复制到剪贴板！');
        setShowSuccessToast(true);
      } else {
        setSuccessMessage('复制失败，请手动复制分享内容');
        setShowSuccessToast(true);
      }
    } catch (error) {
      console.error('分享失败:', error);
      setSuccessMessage('分享失败，请稍后再试');
      setShowSuccessToast(true);
    }
  };

  // 处理下载功能
  const handleDownload = async () => {
    try {
      const imageData = await captureGameCompletionScreenshot();
      const filename = `cat-shower-${playerInfo.playerName}-${Date.now()}.png`;
      downloadImage(imageData, filename);
      
      // 显示图片预览
      setPreviewImageUrl(imageData);
      setShowImagePreview(true);
    } catch (error) {
      console.error('下载失败:', error);
      setSuccessMessage('截图生成失败，请稍后再试');
      setShowSuccessToast(true);
    }
  };

  // 如果显示排名界面，返回排名组件
  if (showRanking) {
    return <LeaderboardRankingScreen onBack={() => setShowRanking(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="bg-[#2f2f2f] overflow-hidden relative game-completion-screen"
        data-testid="game-completion-screen"
        style={{
          width: `${scale(724)}px`,
          height: `${scale(584)}px`,
          ...cssVars
        }}
      >
        {/* 简化的游戏主界面背景 */}
        <div className="absolute inset-0">
          {/* 背景图像 */}
          <div className="absolute inset-0 bg-[url(/background.png)] bg-cover bg-center" />

          {/* 舒适度进度条 */}
          <div 
            className="absolute"
            style={{
              left: `${scale(48)}px`,
              top: `${scale(108)}px`,
              width: `${scale(628)}px`,
              height: `${scale(24)}px`
            }}
          >
            <div 
              className="w-full h-full bg-[#d9d9d9] border-[#3a3656] opacity-60"
              style={{ borderWidth: `${scale(4)}px` }}
            >
              <div className="h-full bg-[#5ff367] w-[75%]" />
            </div>
          </div>

          {/* 温度进度条系统 */}
          <div 
            className="absolute opacity-60"
            style={{
              left: `${scale(48)}px`,
              top: `${scale(136)}px`,
              width: `${scale(628)}px`,
              height: `${scale(78)}px`
            }}
          >
            <div 
              className="absolute bg-[#d9d9d9] border-[#3a3656]"
              style={{
                top: `${scale(9)}px`,
                width: `${scale(628)}px`,
                height: `${scale(24)}px`,
                borderWidth: `${scale(4)}px`
              }}
            >
              <div className="absolute top-0 h-full bg-[#ff9500] opacity-60 left-[40%] w-[20%]" />
              <div className="h-full bg-[#728cff] w-[50%]" />
            </div>
            <div 
              className="absolute bg-[#f8cb56] border-[#3a3656]"
              style={{
                width: `${scale(16)}px`,
                height: `${scale(40)}px`,
                borderWidth: `${scale(5)}px`,
                left: `${scale(306)}px`,
                top: '0'
              }}
            />
          </div>

          {/* 控制按钮 */}
          <div 
            className="absolute opacity-60"
            style={{
              left: `${scale(84)}px`,
              top: `${scale(460)}px`,
              width: `${scale(56)}px`,
              height: `${scale(56)}px`
            }}
          >
            <img className="w-full h-full object-cover" src="/button-temp-minus.png" />
          </div>
          <div 
            className="absolute opacity-60"
            style={{
              left: `${scale(584)}px`,
              top: `${scale(460)}px`,
              width: `${scale(56)}px`,
              height: `${scale(56)}px`
            }}
          >
            <img className="w-full h-full object-cover" src="/button-temp-plus.png" />
          </div>
        </div>

        <div 
          className="relative"
          style={{
            height: `${scale(639)}px`,
            top: `${scale(-53)}px`
          }}
        >

          {/* 半透明遮罩 */}
          <div 
            className="absolute bg-[#545454] opacity-50"
            style={{
              width: `${scale(724)}px`,
              height: `${scale(584)}px`,
              top: `${scale(53)}px`,
              left: '0'
            }}
          />

          {/* 主游戏卡片 */}
          <Card 
            className="absolute border-0 overflow-visible"
            style={{
              width: `${scale(394)}px`,
              height: `${scale(521)}px`,
              top: `${scale(90)}px`,
              left: `${scale(165)}px`
            }}
          >
            <CardContent className="p-0">
              <img
                className="w-full h-full object-cover"
                alt="Card background"
                src="/card-bg-1.png"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = '#f0f0f0';
                }}
              />

              {/* 主猫咪和玩家姓名标签组合 */}
              <div 
                className="absolute flex flex-col items-center left-1/2 transform -translate-x-1/2 animate-float"
                style={{ top: `${scale(48)}px` }}
              >
                {/* 玩家姓名标签 */}
                <div 
                  className="mb-0"
                  style={{
                    width: `${scale(105)}px`,
                    height: `${scale(66)}px`
                  }}
                >
                  <div 
                    className="relative bg-[url(/nametag.png)] bg-contain bg-center bg-no-repeat"
                    style={{
                      width: `${scale(103)}px`,
                      height: `${scale(66)}px`
                    }}
                  >
                    <div 
                      className="absolute left-0 right-0 font-bold text-black tracking-[0] leading-[normal] whitespace-nowrap text-center" 
                      style={{ 
                        fontFamily: 'Pixelify Sans', 
                        fontSize: `${scale(Math.max(12, 30 - playerInfo.playerName.length * 2))}px`,
                        top: `${scale(Math.max(12, 30 - playerInfo.playerName.length * 2) * 2.47)}px` // 根据fontSize:15->top:37的比例计算
                      }}
                    >
                      {playerInfo.playerName.slice(0, 8)}
                    </div>
                  </div>
                </div>
                
                {/* 主猫咪 */}
                <img
                  className="object-cover"
                  style={{
                    width: `${scale(120)}px`,
                    height: `${scale(120)}px`,
                  }}
                  alt="Main Cat"
                  src={`/Cat_${playerInfo.catAvatarId}.png`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/Cat_1.png";
                  }}
                />
              </div>

              {/* 其他猫咪动画 */}
              {cats.map((cat, index) => (
                <img
                  key={`cat-${index}`}
                  className={`absolute object-cover ${cat.flipped ? 'scale-x-[-1]' : ''}`}
                  style={{
                    width: `${scale(cat.size)}px`,
                    height: `${scale(cat.size)}px`,
                    top: `${scale(cat.top)}px`,
                    left: `${scale(cat.left)}px`,
                  }}
                  alt="Cat"
                  src={cat.src}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/Cat_1.png";
                  }}
                />
              ))}

              {/* 排名状态卡片 */}
              <div 
                className="absolute bg-[#e6f9ff]"
                style={{
                  width: `${scale(350)}px`,
                  height: `${scale(63)}px`,
                  top: `${scale(316)}px`,
                  left: `${scale(16)}px`,
                  borderRadius: `${scale(15)}px`
                }}
              >
                <div 
                  className="leading-[normal] absolute font-normal text-transparent tracking-[0]" 
                  style={{ 
                    fontFamily: 'Pixelify Sans',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    lineHeight: 'normal',
                    height: `${scale(34)}px`,
                    top: `${scale(11)}px`,
                    width: `${scale(291)}px`,
                    left: `${scale(59)}px`,
                    fontSize: `${scale(24)}px`
                  }}
                >
                  <span className="text-black">{playerInfo.continentId} is </span>
                  <span 
                    className="text-[#fab817] font-bold"
                    style={{ fontSize: `${scale(28)}px` }}
                  >
                    #1
                  </span>
                </div>

                <img
                  className="absolute object-cover"
                  style={{
                    width: `${scale(36)}px`,
                    height: `${scale(36)}px`,
                    top: `${scale(12)}px`,
                    left: `${scale(14)}px`
                  }}
                  alt="Ranking badge"
                  src="/rankingbadge--1.png"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* 成绩状态卡片 */}
              <div 
                className="absolute bg-[#e6f9ff]"
                style={{
                  width: `${scale(350)}px`,
                  height: `${scale(72)}px`,
                  top: `${scale(391)}px`,
                  left: `${scale(16)}px`,
                  borderRadius: `${scale(15)}px`
                }}
              >
                <div 
                  className="absolute font-normal text-transparent tracking-[0]" 
                  style={{ 
                    fontFamily: 'Pixelify Sans',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    lineHeight: 'normal',
                    top: `${scale(9)}px`,
                    width: `${scale(291)}px`,
                    left: `${scale(59)}px`,
                    fontSize: `${scale(24)}px`
                  }}
                >
                  <span className="text-black">
                    Scrubbed for {formatTime(gameStats.enduranceDuration)}!
                  </span>
                </div>

                <img
                  className="absolute object-cover"
                  style={{
                    width: `${scale(36)}px`,
                    height: `${scale(36)}px`,
                    top: `${scale(15)}px`,
                    left: `${scale(14)}px`
                  }}
                  alt="Victory hand"
                  src="/icon-victoryhand.png"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* 操作按钮 */}
              <div 
                className="absolute flex justify-center w-full"
                style={{ 
                  gap: `${scale(16)}px`,
                  bottom: `${scale(-10)}px`
                }}
              >
                <Button
                  variant="ghost"
                  className="p-0 rounded-md"
                  style={{
                    width: `${scale(56)}px`,
                    height: `${scale(56)}px`
                  }}
                  onClick={onPlayAgain}
                >
                  <img
                    className="w-full h-full object-cover"
                    alt="Restart"
                    src="/icon-restart.png"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.alt = "🔄";
                    }}
                  />
                </Button>
                {/* 分享按钮 */}
                <Button
                  variant="ghost"
                  className="p-0 rounded-md"
                  style={{
                    width: `${scale(56)}px`,
                    height: `${scale(56)}px`
                  }}
                  onClick={handleShare}
                >
                  <img
                    className="w-full h-full object-cover"
                    alt="Share"
                    src="/icon-share.png"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.alt = "📤";
                    }}
                  />
                </Button>

                <Button
                  variant="ghost"
                  className="p-0 rounded-md"
                  style={{
                    width: `${scale(59)}px`,
                    height: `${scale(59)}px`
                  }}
                  onClick={() => setShowRanking(true)}
                >
                  <img
                    className="w-full h-full object-cover"
                    alt="Ranking"
                    src="/icon-ranking.png"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.alt = "🏆";
                    }}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 标题横幅 */}
          <div 
            className="absolute top-0"
            style={{
              width: `${scale(363)}px`,
              height: `${scale(206)}px`,
              left: `${scale(180.5)}px`
            }}
          >
            <div 
              className="relative"
              style={{
                width: `${scale(361)}px`,
                height: `${scale(153)}px`,
                top: `${scale(53)}px`,
                left: `${scale(-4)}px`
              }}
            >
              <img
                className="object-cover absolute top-0"
                style={{
                  width: `${scale(309)}px`,
                  height: `${scale(153)}px`,
                  left: `${scale(26)}px`
                }}
                alt="Banner"
                src="/banner-succ.png"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />

              {/* 洲际图片 */}
              <div 
                className="absolute flex items-center justify-center"
                style={{
                  width: `${scale(200)}px`,
                  height: `${scale(25)}px`,
                  top: `${scale(29)}px`,
                  left: `${scale(79)}px`,
                }}
              >
                <img
                  className="max-w-full max-h-full object-contain"
                  alt={`Continent ${playerInfo.continentId}`}
                  src={getContinentImage(playerInfo.continentId)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/asia.png';
                  }}
                />
              </div>
            </div>
          </div>

          {/* 下载按钮 */}
          <Button
            variant="ghost"
            className="absolute p-0 rounded-md"
            style={{
              width: `${scale(56)}px`,
              height: `${scale(56)}px`,
              top: `${scale(108)}px`,
              left: `${scale(570)}px`
            }}
            onClick={handleDownload}
          >
            <img
              className="w-full h-full object-cover"
              alt="Download"
              src="/icon-download.png"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.alt = "💾";
              }}
            />
          </Button>
        </div>
      </div>

      {/* 图片预览模态框 */}
      <ImagePreviewModal
        isOpen={showImagePreview}
        imageUrl={previewImageUrl}
        onClose={() => setShowImagePreview(false)}
      />

      {/* 成功提示 */}
      <SuccessToast
        isOpen={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
};