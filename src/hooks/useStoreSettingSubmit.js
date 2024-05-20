import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import

import { SidebarContext } from "@/context/SidebarContext";
import SettingServices from "@/services/SettingServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useStoreSettingSubmit = (id) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const [isSave, setIsSave] = useState(true);
  const [metaImg, setMetaImg] = useState("");
  const [favicon, setFavicon] = useState("");
  const [enabledCOD, setEnabledCOD] = useState(true);
  const [enabledStripe, setEnabledStripe] = useState(true);
  const [enabledFbPixel, setEnableFbPixel] = useState(true);
  const [enabledTawkChat, setEnabledTawkChat] = useState(false);
  const [enabledGoogleLogin, setEnabledGoogleLogin] = useState(true);
  const [enabledGoogleAnalytics, setEnabledGoogleAnalytics] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log("data", data);
    // return notifyError("This feature is disabled for demo!");
    try {
      setIsSubmitting(true);
      const settingData = {
        name: "storeSetting",
        setting: {
          cod_status: enabledCOD,
          stripe_status: enabledStripe,
          stripe_key: data.stripe_key,
          stripe_secret: data.stripe_secret,
          google_login_status: enabledGoogleLogin,
          google_client_id: data.google_client_id,
          google_secret_key: data.google_secret_key,
          google_analytic_status: enabledGoogleAnalytics,
          google_analytic_key: data.google_analytic_key,
          fb_pixel_status: enabledFbPixel,
          fb_pixel_key: data.fb_pixel_key,
          tawk_chat_status: enabledTawkChat,
          tawk_chat_property_id: data.tawk_chat_property_id,
          tawk_chat_widget_id: data.tawk_chat_widget_id,
        },
      };

      // console.log("store setting", settingData, "data", data);
      // return;

      if (!isSave) {
        const res = await SettingServices.updateStoreSetting(settingData);
        setIsUpdate(true);
        setIsSubmitting(false);
        window.location.reload();
        notifySuccess(res.message);
      } else {
        const res = await SettingServices.addStoreSetting(settingData);
        setIsUpdate(true);
        setIsSubmitting(false);
        window.location.reload();
        notifySuccess(res.message);
      }
    } catch (err) {
      // console.log("err", err);
      notifyError(err?.response?.data?.message || err?.message);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await SettingServices.getStoreSetting();
        // console.log("res>>>", res);
        if (res) {
          setIsSave(false);
          // for store setting
          setEnabledCOD(res.cod_status);
          setEnabledStripe(res.stripe_status);
          setEnableFbPixel(res.fb_pixel_status);
          setEnabledTawkChat(res.tawk_chat_status);
          setEnabledGoogleLogin(res.google_login_status);
          setEnabledGoogleAnalytics(res.google_analytic_status);
          setValue("stripe_key", res.stripe_key);
          setValue("stripe_secret", res.stripe_secret);
          setValue("google_client_id", res.google_client_id);
          setValue("google_secret_key", res.google_secret_key);
          setValue("google_analytic_key", res.google_analytic_key);
          setValue("fb_pixel_key", res.fb_pixel_key);
          setValue("tawk_chat_property_id", res.tawk_chat_property_id);
          setValue("tawk_chat_widget_id", res.tawk_chat_widget_id);
        }
      } catch (err) {
        notifyError(err?.response?.data?.message || err.message);
      }
    })();
  }, []);

  return {
    errors,
    register,
    isSave,
    favicon,
    setFavicon,
    metaImg,
    setMetaImg,
    isSubmitting,
    onSubmit,
    handleSubmit,
    enabledCOD,
    setEnabledCOD,
    enabledStripe,
    setEnabledStripe,
    enabledFbPixel,
    setEnableFbPixel,
    enabledTawkChat,
    setEnabledTawkChat,
    enabledGoogleLogin,
    setEnabledGoogleLogin,
    enabledGoogleAnalytics,
    setEnabledGoogleAnalytics,
  };
};

export default useStoreSettingSubmit;
