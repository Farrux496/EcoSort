import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Edit2,
  Coins,
  CheckCircle2,
  AlertCircle,
  Truck,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Header } from '../common/Header';
import { Language, User, WasteCategoryId, CourierType } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService, WASTE_CATEGORIES, ASSETS } from '../../services/storage';

interface ScannerViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
  onSuccessSubmit: () => void;
  preselectedCategoryId?: WasteCategoryId;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  user,
  lang,
  onBack,
  onSuccessSubmit,
  preselectedCategoryId = 'plastic',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategoryId>(preselectedCategoryId);
  const [weightKg, setWeightKg] = useState<number>(5.0);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [customWeightInput, setCustomWeightInput] = useState('5');
  const [previewImage, setPreviewImage] = useState<string>(ASSETS.plastic);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState(98.4);

  // Camera video stream
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Courier step modal
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [courierType, setCourierType] = useState<CourierType>(weightKg > 30 ? 'tezkor' : 'haftalik');
  const [pickupDate, setPickupDate] = useState('2026-09-28');
  const [pickupTime, setPickupTime] = useState('10:00 - 12:00');
  const [pickupAddress, setPickupAddress] = useState(
    `${user.region || 'Nókis qalası'}, ${user.street || 'M. Ájiniyaz kóshesi'}, ${user.houseNumber || '12'}`
  );

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch {
      // Fallback if camera permission is denied or in non-ssl/restricted iframe
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreviewImage(dataUrl);
        stopCamera();
        simulateAiDetection();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
          simulateAiDetection();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAiDetection = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setConfidence(Number((95 + Math.random() * 4.5).toFixed(1)));
    }, 600);
  };

  const currentCategoryObj =
    WASTE_CATEGORIES.find((c) => c.id === selectedCategory) || WASTE_CATEGORIES[0];
  const calculatedCoins = Math.round(weightKg * currentCategoryObj.ratePerKg);

  const handleSaveWeight = () => {
    const val = parseFloat(customWeightInput);
    if (!isNaN(val) && val > 0) {
      setWeightKg(val);
      // Auto adjust courier preference if > 30kg
      if (val > 30) {
        setCourierType('tezkor');
      } else {
        setCourierType('haftalik');
      }
    }
    setIsEditingWeight(false);
  };

  const handleProceedToCourier = () => {
    setShowCourierModal(true);
  };

  const handleFinalSubmit = () => {
    const submissionId = `sub-${Date.now()}`;
    const newSubmission = {
      id: submissionId,
      userId: user.id,
      userName: user.fullName,
      categoryId: selectedCategory,
      categoryName: getTranslation(lang, currentCategoryObj.nameKey as any),
      weightKg,
      coinsEarned: calculatedCoins,
      imageUrl: previewImage,
      courierType,
      courierDate: pickupDate,
      courierTime: pickupTime,
      address: pickupAddress,
      status: 'pending' as const,
      courierStatus: 'Kútilmekte' as const,
      createdAt: new Date().toLocaleString(),
    };

    StorageService.addSubmission(newSubmission);

    // Add local notification
    StorageService.addNotification({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title:
        lang === 'kaa'
          ? 'Qaldıq tekseriwge jiberildi'
          : lang === 'uz'
          ? 'Chiqindi tekshiruvga yuborildi'
          : 'Отходы отправлены на проверку',
      message: `${weightKg} kg ${newSubmission.categoryName} (${calculatedCoins} EcoCoin). ${
        courierType === 'tezkor' ? 'Tezkor kuryer' : 'Haftalik kuryer'
      } rejelestirildi.`,
      type: 'courier_scheduled',
      date: new Date().toLocaleDateString(),
      read: false,
    });

    setShowCourierModal(false);
    onSuccessSubmit();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 flex flex-col justify-between">
      <div>
        <Header
          title={getTranslation(lang, 'scannerTitle')}
          showBack
          onBack={onBack}
        />

        <div className="p-4 max-w-md mx-auto space-y-4">
          {/* Camera Viewfinder Frame matching Screen 3 */}
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border-2 border-emerald-500/80 shadow-md">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={previewImage}
                alt="Waste scan target"
                className="w-full h-full object-cover transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Viewfinder Target Brackets (Corner UI) */}
            <div className="absolute inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

              {/* Center scan line effect */}
              {isAnalyzing && (
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse absolute top-1/2 transform -translate-y-1/2" />
              )}
            </div>

            {/* Demo AI Badge matching requirement */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 border border-emerald-400/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>
                {getTranslation(lang, 'demoAiNotice')}: {confidence}%
              </span>
            </div>

            {/* Quick Camera & Upload Action bar on top of Viewfinder */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {isCameraActive ? (
                <button
                  onClick={capturePhoto}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>{getTranslation(lang, 'takePhoto')}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={startCamera}
                    className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-xs text-xs shadow-md transition-colors"
                    title={getTranslation(lang, 'takePhoto')}
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-xs text-xs shadow-md transition-colors"
                    title={getTranslation(lang, 'uploadPhoto')}
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Waste Category Selection Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {WASTE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPreviewImage(cat.image);
                  simulateAiDetection();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0D7C66] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{getTranslation(lang, cat.nameKey as any).split(' ')[0]}</span>
                <span className="text-[10px] opacity-80">({cat.ratePerKg})</span>
              </button>
            ))}
          </div>

          {/* Recognized item card matching Screen 3 */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/80 p-1 flex items-center justify-center shrink-0">
                <img
                  src={currentCategoryObj.image}
                  alt={currentCategoryObj.id}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  {getTranslation(lang, currentCategoryObj.nameKey as any)}
                </h3>
                <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                  {getTranslation(lang, currentCategoryObj.descriptionKey as any)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Tarif</span>
              <span className="text-xs font-extrabold text-[#0D7C66]">
                {currentCategoryObj.ratePerKg} EcoCoin/kg
              </span>
            </div>
          </div>

          {/* Estimated Weight Row matching Screen 3 */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              {getTranslation(lang, 'estimatedWeight')}
            </span>

            {isEditingWeight ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="500"
                  value={customWeightInput}
                  onChange={(e) => setCustomWeightInput(e.target.value)}
                  className="w-20 px-2 py-1 text-sm font-extrabold text-right border border-emerald-500 rounded-lg focus:outline-none"
                  autoFocus
                />
                <span className="text-xs font-bold text-slate-700">kg</span>
                <button
                  onClick={handleSaveWeight}
                  className="p-1 bg-[#0D7C66] text-white rounded-md text-xs"
                >
                  ✓
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCustomWeightInput(String(weightKg));
                  setIsEditingWeight(true);
                }}
                className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded-xl transition-colors"
              >
                <span className="text-base font-extrabold text-slate-800">
                  {weightKg} kg
                </span>
                <Edit2 className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* Calculated Bonus Row matching Screen 3 */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-xs font-bold text-slate-600">
                {getTranslation(lang, 'calculatedBonus')}
              </span>
            </div>

            <span className="text-base font-extrabold text-emerald-800">
              {calculatedCoins.toLocaleString()} EcoCoin
            </span>
          </div>

          {/* Quick weight selector helper */}
          <div className="flex items-center justify-between gap-1.5 px-1">
            <span className="text-[11px] font-medium text-slate-400">Tez tanlaw:</span>
            {[2, 5, 10, 20, 35].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setWeightKg(preset);
                  if (preset > 30) setCourierType('tezkor');
                  else setCourierType('haftalik');
                }}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  weightKg === preset
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {preset} kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Confirm Button matching Screen 3 */}
      <div className="p-4 max-w-md mx-auto w-full">
        <button
          onClick={handleProceedToCourier}
          className="w-full py-4 bg-[#0D7C66] hover:bg-[#095848] text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-900/15 active:scale-[0.98] transition-all flex items-center justify-center tracking-wide"
        >
          {getTranslation(lang, 'confirm')}
        </button>
      </div>

      {/* Courier Selection Modal Before Final Submission */}
      {showCourierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#0D7C66]" />
                <h3 className="text-base font-bold text-slate-800">
                  {getTranslation(lang, 'selectCourier')}
                </h3>
              </div>
              <button
                onClick={() => setShowCourierModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {/* Summary pill */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900">
                  {weightKg} kg · {getTranslation(lang, currentCategoryObj.nameKey as any)}
                </span>
                <span className="font-extrabold text-emerald-700">
                  +{calculatedCoins} EcoCoin
                </span>
              </div>

              {/* Courier Option 1: TEZKOR KURYER (Active ONLY if weight > 30 kg) */}
              <div
                onClick={() => {
                  if (weightKg > 30) {
                    setCourierType('tezkor');
                  }
                }}
                className={`p-4 rounded-2xl border transition-all ${
                  weightKg <= 30
                    ? 'border-slate-200 bg-slate-50/80 opacity-70 cursor-not-allowed'
                    : courierType === 'tezkor'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 cursor-pointer'
                    : 'border-slate-200 hover:border-slate-300 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        weightKg > 30
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {getTranslation(lang, 'tezkorCourier')}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {getTranslation(lang, 'tezkorCourierDesc')}
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="courier_option"
                    checked={courierType === 'tezkor'}
                    disabled={weightKg <= 30}
                    onChange={() => {
                      if (weightKg > 30) setCourierType('tezkor');
                    }}
                    className="mt-1"
                  />
                </div>

                {weightKg <= 30 ? (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {getTranslation(lang, 'tezkorCourierUnavailable', { kg: weightKg })}
                    </span>
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-100/70 p-1.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{getTranslation(lang, 'tezkorCourierAvailable')}</span>
                  </div>
                )}
              </div>

              {/* Courier Option 2: HAFTALIK KURYER (Available for EVERY user) */}
              <div
                onClick={() => setCourierType('haftalik')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  courierType === 'haftalik'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      📅
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {getTranslation(lang, 'haftalikCourier')}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {getTranslation(lang, 'haftalikCourierDesc')}
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="courier_option"
                    checked={courierType === 'haftalik'}
                    onChange={() => setCourierType('haftalik')}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Courier Schedule details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0D7C66]" />
                    <span>{getTranslation(lang, 'pickupDate')}</span>
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0D7C66]" />
                    <span>{getTranslation(lang, 'pickupTime')}</span>
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option value="09:00 - 11:00">09:00 - 11:00</option>
                    <option value="11:00 - 13:00">11:00 - 13:00</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0D7C66]" />
                    <span>{getTranslation(lang, 'pickupAddress')}</span>
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Submit Waste Button */}
              <button
                onClick={handleFinalSubmit}
                className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#095848] text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{getTranslation(lang, 'submitWaste')}</span>
                <span>✓</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
