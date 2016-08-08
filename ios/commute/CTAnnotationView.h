//
//  CTAnnotationView.h
//  commute
//
//  Created by Alexis Kinsella on 04/08/2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface CTAnnotationView : UIView

@property (nonatomic, assign) BOOL useSmallPin;
@property (nonatomic, assign) NSNumber *value;
@property (nonatomic, assign) CGFloat lineWidth;
@property (nonatomic, assign) CGFloat opacity;
@property (nonatomic, assign) CGFloat fontSize;
@property (nonatomic, assign) NSNumber *strokeColor;
@property (nonatomic, assign) NSNumber *bgColor;
@property (nonatomic, assign) NSString *fontWeight;
@property (nonatomic, assign) NSNumber *number;

@end
