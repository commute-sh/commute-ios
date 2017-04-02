package com.commute;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.smixx.fabric.FabricPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.higo.zhangyp.segmented.AndroidSegmentedPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.List;

import static java.util.Arrays.asList;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return asList(
          new RNSpinkitPackage(),
          new MainReactPackage(),
          new LinearGradientPackage(),
          new VectorIconsPackage(),
          new SvgPackage(),
          new MapsPackage(),
          new FabricPackage(),
          new RNSpinkitPackage(),
          new AndroidSegmentedPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }

  @Override
    public void onCreate() {
      super.onCreate();
      SoLoader.init(this, /* native exopackage */ false);
    }

}
