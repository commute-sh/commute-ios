//
//  CTAnnotationManager.m
//  commute
//
//  Created by Alexis Kinsella on 04/08/2016.
//  Copyright © 2016 Commute.sh. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <MapKit/MapKit.h>

#import "RCTViewManager.h"

#import "CTAnnotationView.h"

@interface CTAnnotationViewManager : RCTViewManager
@end

@implementation CTAnnotationViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(pinSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(value, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(lineWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(fontSize, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(bgColor, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(fontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(number, NSNumber)

RCT_REMAP_VIEW_PROPERTY(opacity, alpha, CGFloat)

- (UIView *)view
{
  CTAnnotationView * annotationView = [[CTAnnotationView alloc] init];
  
  return annotationView;
}

@end
