//
//  CTAnnotationView.m
//  commute
//
//  Created by Alexis Kinsella on 04/08/2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "CTAnnotationView.h"
#import "RCTConvert.h"
#import "RCTFont.h"

@implementation CTAnnotationView

- (void)drawRect:(CGRect)rect {
  
//  NSLog(@"Number: %@, use Small Pin: %d", self.number, self.useSmallPin);
  
  [super drawRect:rect];
  
  CGColorRef strokeColor = [RCTConvert CGColor: self.strokeColor];
  CGColorRef backgroundColor = [RCTConvert CGColor: self.bgColor];
  
  CGFloat lineWidth = self.lineWidth;
  CGRect borderRect = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
  borderRect = CGRectInset(borderRect, lineWidth * 0.5, lineWidth * 0.5);
  CGContextRef context = UIGraphicsGetCurrentContext();
  
  
  if ([self.pinSize integerValue] > 16) {
    CGContextSetStrokeColorWithColor(context, strokeColor);
    CGContextSetLineWidth(context, self.lineWidth);
    CGContextStrokeEllipseInRect(context, borderRect);
  }
  
  CGContextSetFillColorWithColor(context, [self.pinSize integerValue] <= 16 ? strokeColor : backgroundColor);
  CGContextFillEllipseInRect (context, borderRect);
  CGContextFillPath(context);


  if ([self.pinSize integerValue] > 16) {
    NSString *string = [NSString stringWithFormat:@"%@", self.value];
    
    NSMutableParagraphStyle* style = [[NSMutableParagraphStyle alloc] init];
    [style setAlignment:NSTextAlignmentCenter];
    
    UIFont * font = [RCTFont updateFont: [UIFont fontWithName:@"System" size: self.fontSize] withWeight: self.fontWeight];
    
    NSDictionary *textAttributes = @{
                                     NSFontAttributeName: font,
                                     NSForegroundColorAttributeName: [self.pinSize integerValue] <= 16 ? [UIColor whiteColor] : [RCTConvert UIColor: self.strokeColor],
                                     NSParagraphStyleAttributeName: style
                                     };
    
    CGRect newFrame = self.frame;
    newFrame.origin.y = (self.frame.size.height - font.lineHeight) / 2;
    
    [string drawInRect: newFrame withAttributes:textAttributes];
  }
}

@end
