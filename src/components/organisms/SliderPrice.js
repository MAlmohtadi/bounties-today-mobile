import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Animated,
  PanResponder,
  View,
  ViewPropTypes,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import FollowerContainer from './LabelContainer';

/**
 * low and high state variables are fallbacks for props (props are not required).
 * This hook ensures that current low and high are not out of [min, max] range.
 * It returns an object which contains:
 * - ref containing correct low, high, min, max and step to work with.
 * - setLow and setHigh setters
 * @param lowProp
 * @param highProp
 * @param min
 * @param max
 * @param step
 * @returns {{inPropsRef: React.MutableRefObject<{high: (*|number), low: (*|number)}>, setLow: (function(number): undefined), setHigh: (function(number): undefined)}}
 */
const useLowHigh = (lowProp, highProp, min, max, step) => {
  const validLowProp = lowProp === undefined ? min : clamp(lowProp, min, max);
  const validHighProp =
    highProp === undefined ? max : clamp(highProp, min, max);
  const inPropsRef = useRef({low: validLowProp, high: validHighProp});
  const {low: lowState, high: highState} = inPropsRef.current;
  const inPropsRefPrev = {lowPrev: lowState, highPrev: highState};

  // Props have higher priority.
  // If no props are passed, use internal state variables.
  const low = clamp(lowProp === undefined ? lowState : lowProp, min, max);
  const high = clamp(highProp === undefined ? highState : highProp, min, max);

  // Always update values of refs so pan responder will have updated values
  Object.assign(inPropsRef.current, {low, high, min, max, step});

  const setLow = (value) => (inPropsRef.current.low = value);
  const setHigh = (value) => (inPropsRef.current.high = value);
  return {inPropsRef, inPropsRefPrev, setLow, setHigh};
};

/**
 * Sets the current value of widthRef and calls the callback with new width parameter.
 * @param widthRef
 * @param callback
 * @returns {function({nativeEvent: *}): void}
 */
const useWidthLayout = (widthRef, callback) => {
  return useCallback(
    ({nativeEvent}) => {
      const {
        layout: {width},
      } = nativeEvent;
      const {current: w} = widthRef;
      if (w !== width) {
        widthRef.current = width;
        if (callback) {
          callback(width);
        }
      }
    },
    [callback, widthRef],
  );
};

/**
 * This hook creates a component which follows the thumb.
 * Content renderer is passed to FollowerContainer which re-renders only it's content with setValue method.
 * This allows to re-render only follower, instead of the whole slider with all children (thumb, rail, etc.).
 * Returned update function should be called every time follower should be updated.
 * @param containerWidthRef
 * @param gestureStateRef
 * @param renderContent
 * @param isPressed
 * @param allowOverflow
 * @returns {[JSX.Element, function(*, *=): void]|*[]}
 */
const useThumbFollower = (
  containerWidthRef,
  gestureStateRef,
  renderContent,
  isPressed,
  allowOverflow,
) => {
  const xRef = useRef(new Animated.Value(0));
  const widthRef = useRef(0);
  const contentContainerRef = useRef(null);

  const {current: x} = xRef;

  const update = useCallback(
    (thumbPositionInView, value) => {
      const {current: width} = widthRef;
      const {current: containerWidth} = containerWidthRef;
      const position = thumbPositionInView - width / 2;
      xRef.current.setValue(
        allowOverflow ? position : clamp(position, 0, containerWidth - width),
      );
      contentContainerRef.current.setValue(value);
    },
    [widthRef, containerWidthRef, allowOverflow],
  );

  const handleLayout = useWidthLayout(widthRef, () => {
    update(
      gestureStateRef.current.lastPosition,
      gestureStateRef.current.lastValue,
    );
  });

  if (!renderContent) {
    return [];
  }

  const transform = {transform: [{translateX: x}]};
  const follower = (
    <Animated.View style={[transform, {opacity: isPressed ? 1 : 0}]}>
      <FollowerContainer
        onLayout={handleLayout}
        ref={contentContainerRef}
        renderContent={renderContent}
      />
    </Animated.View>
  );
  return [follower, update];
};

const useSelectedRail = (
  inPropsRef,
  containerWidthRef,
  thumbWidth,
  disableRange,
) => {
  const {current: left} = useRef(new Animated.Value(0));
  const {current: right} = useRef(new Animated.Value(0));
  const update = useCallback(() => {
    const {low, high, min, max} = inPropsRef.current;
    const {current: containerWidth} = containerWidthRef;
    const fullScale = (max - min) / (containerWidth - thumbWidth);
    const leftValue = (low - min) / fullScale;
    const rightValue = (max - high) / fullScale;
    left.setValue(disableRange ? 0 : leftValue);
    right.setValue(
      disableRange ? containerWidth - thumbWidth - leftValue : rightValue,
    );
  }, [inPropsRef, containerWidthRef, disableRange, thumbWidth, left, right]);
  const styles = useMemo(
    () => ({
      position: 'absolute',
      left,
      right,
    }),
    [left, right],
  );
  return [styles, update];
};

/**
 * @param floating
 * @returns {{onLayout: ((function({nativeEvent: *}): void)|undefined), style: [*, {top}]}}
 */
const useLabelContainerProps = (floating) => {
  const [labelContainerHeight, setLabelContainerHeight] = useState(0);
  const onLayout = useCallback(({nativeEvent}) => {
    const {
      layout: {height},
    } = nativeEvent;
    setLabelContainerHeight(height);
  }, []);

  const top = floating ? -labelContainerHeight : 0;
  const style = [
    floating ? styles.labelFloatingContainer : styles.labelFixedContainer,
    {top},
  ];
  return {style, onLayout: onLayout};
};

const isLowCloser = (downX, lowPosition, highPosition) => {
  if (lowPosition === highPosition) {
    return downX < lowPosition;
  }
  const distanceFromLow = Math.abs(downX - lowPosition);
  const distanceFromHigh = Math.abs(downX - highPosition);
  return distanceFromLow < distanceFromHigh;
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const getValueForPosition = (
  positionInView,
  containerWidth,
  thumbWidth,
  min,
  max,
  step,
) => {
  const availableSpace = containerWidth - thumbWidth;
  const relStepUnit = step / (max - min);
  let relPosition = (positionInView - thumbWidth / 2) / availableSpace;
  const relOffset = relPosition % relStepUnit;
  relPosition -= relOffset;
  if (relOffset / relStepUnit >= 0.5) {
    relPosition += relStepUnit;
  }
  return clamp(min + Math.round(relPosition / relStepUnit) * step, min, max);
};

const trueFunc = () => true;
const noop = () => {};

const Slider = ({
  min,
  max,
  step,
  low: lowProp,
  high: highProp,
  floatingLabel,
  allowLabelOverflow,
  disableRange,
  disabled,
  onValueChanged,
  renderThumb,
  renderLabel,
  renderNotch,
  renderRail,
  renderRailSelected,
  ...restProps
}) => {
  const {inPropsRef, inPropsRefPrev, setLow, setHigh} = useLowHigh(
    lowProp,
    disableRange ? max : highProp,
    min,
    max,
    step,
  );
  const lowThumbXRef = useRef(new Animated.Value(0));
  const highThumbXRef = useRef(new Animated.Value(0));
  const pointerX = useRef(new Animated.Value(0)).current;
  const {current: lowThumbX} = lowThumbXRef;
  const {current: highThumbX} = highThumbXRef;

  const gestureStateRef = useRef({isLow: true, lastValue: 0, lastPosition: 0});

  const containerWidthRef = useRef(0);
  const [thumbWidth, setThumbWidth] = useState(0);

  const [selectedRailStyle, updateSelectedRail] = useSelectedRail(
    inPropsRef,
    containerWidthRef,
    thumbWidth,
    disableRange,
  );

  const updateThumbs = useCallback(() => {
    const {current: containerWidth} = containerWidthRef;
    if (!thumbWidth || !containerWidth) {
      return;
    }
    const {low, high} = inPropsRef.current;
    if (!disableRange) {
      const {current: highThumbX} = highThumbXRef;
      const highPosition =
        ((high - min) / (max - min)) * (containerWidth - thumbWidth);
      highThumbX.setValue(highPosition);
    }
    const {current: lowThumbX} = lowThumbXRef;
    const lowPosition =
      ((low - min) / (max - min)) * (containerWidth - thumbWidth);
    lowThumbX.setValue(lowPosition);
    updateSelectedRail();
    onValueChanged(low, high, false);
  }, [
    disableRange,
    inPropsRef,
    max,
    min,
    onValueChanged,
    thumbWidth,
    updateSelectedRail,
  ]);

  useEffect(() => {
    const {lowPrev, highPrev} = inPropsRefPrev;
    if (
      (lowProp !== undefined && lowProp !== lowPrev) ||
      (highProp !== undefined && highProp !== highPrev)
    ) {
      updateThumbs();
    }
  }, [
    highProp,
    inPropsRefPrev.lowPrev,
    inPropsRefPrev.highPrev,
    lowProp,
    inPropsRefPrev,
    updateThumbs,
  ]);

  useEffect(() => {
    updateThumbs();
  }, [updateThumbs]);

  const handleContainerLayout = useWidthLayout(containerWidthRef, updateThumbs);
  const handleThumbLayout = useCallback(
    ({nativeEvent}) => {
      const {
        layout: {width},
      } = nativeEvent;
      if (thumbWidth !== width) {
        setThumbWidth(width);
      }
    },
    [thumbWidth],
  );

  const lowStyles = useMemo(() => {
    return {transform: [{translateX: lowThumbX}]};
  }, [lowThumbX]);

  const highStyles = useMemo(() => {
    return disableRange
      ? null
      : [styles.highThumbContainer, {transform: [{translateX: highThumbX}]}];
  }, [disableRange, highThumbX]);

  const railContainerStyles = useMemo(() => {
    return [styles.railsContainer, {marginHorizontal: thumbWidth / 2}];
  }, [thumbWidth]);

  const [labelView, labelUpdate] = useThumbFollower(
    containerWidthRef,
    gestureStateRef,
    renderLabel,
    true,
    allowLabelOverflow,
  );

  const lowThumb = renderThumb();
  const highThumb = renderThumb();

  const labelContainerProps = useLabelContainerProps(floatingLabel);

  const {panHandlers} = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: trueFunc,
        onStartShouldSetPanResponderCapture: trueFunc,
        onMoveShouldSetPanResponder: trueFunc,
        onMoveShouldSetPanResponderCapture: trueFunc,
        onPanResponderTerminationRequest: trueFunc,
        onPanResponderTerminate: trueFunc,
        onShouldBlockNativeResponder: trueFunc,

        onPanResponderGrant: ({nativeEvent}, gestureState) => {
          if (disabled) {
            return;
          }
          const {numberActiveTouches} = gestureState;
          if (numberActiveTouches > 1) {
            return;
          }
          // setPressed(true);
          const {current: lowThumbX} = lowThumbXRef;
          const {current: highThumbX} = highThumbXRef;
          const {locationX: downX, pageX} = nativeEvent;
          const containerX = pageX - downX;

          const {low, high, min, max} = inPropsRef.current;
          const containerWidth = containerWidthRef.current;

          const lowPosition =
            thumbWidth / 2 +
            ((low - min) / (max - min)) * (containerWidth - thumbWidth);
          const highPosition =
            thumbWidth / 2 +
            ((high - min) / (max - min)) * (containerWidth - thumbWidth);

          const isLow =
            disableRange || isLowCloser(downX, lowPosition, highPosition);
          gestureStateRef.current.isLow = isLow;

          const handlePositionChange = (positionInView) => {
            const {low, high, min, max, step} = inPropsRef.current;
            const minValue = isLow ? min : low;
            const maxValue = isLow ? high : max;
            const value = clamp(
              getValueForPosition(
                positionInView,
                containerWidth,
                thumbWidth,
                min,
                max,
                step,
              ),
              minValue,
              maxValue,
            );
            if (gestureStateRef.current.lastValue === value) {
              return;
            }
            const availableSpace = containerWidth - thumbWidth;
            const absolutePosition =
              ((value - min) / (max - min)) * availableSpace;
            gestureStateRef.current.lastValue = value;
            gestureStateRef.current.lastPosition =
              absolutePosition + thumbWidth / 2;
            (isLow ? lowThumbX : highThumbX).setValue(absolutePosition);
            onValueChanged(isLow ? value : low, isLow ? high : value, true);
            (isLow ? setLow : setHigh)(value);
            labelUpdate &&
              labelUpdate(gestureStateRef.current.lastPosition, value);
            updateSelectedRail();
          };
          handlePositionChange(downX);
          pointerX.removeAllListeners();
          pointerX.addListener(({value: pointerPosition}) => {
            const positionInView = pointerPosition - containerX;
            handlePositionChange(positionInView);
          });
        },

        onPanResponderMove: disabled
          ? undefined
          : Animated.event([null, {moveX: pointerX}], {useNativeDriver: false}),

        onPanResponderRelease: () => {
          // setPressed(false);
        },
      }),
    [
      pointerX,
      inPropsRef,
      thumbWidth,
      disableRange,
      disabled,
      onValueChanged,
      setLow,
      setHigh,
      labelUpdate,
      updateSelectedRail,
    ],
  );

  return (
    <View {...restProps}>
      <View onLayout={handleContainerLayout} style={styles.controlsContainer}>
        <View style={railContainerStyles}>
          {renderRail()}
          <Animated.View style={selectedRailStyle}>
            {renderRailSelected()}
          </Animated.View>
        </View>
        <Animated.View style={lowStyles} onLayout={handleThumbLayout}>
          {lowThumb}
        </Animated.View>
        {!disableRange && (
          <Animated.View style={highStyles}>{highThumb}</Animated.View>
        )}
        <View
          {...panHandlers}
          style={styles.touchableArea}
          collapsable={false}
        />
      </View>
      <View {...labelContainerProps}>{labelView}</View>
    </View>
  );
};

Slider.propTypes = {
  ...ViewPropTypes,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  renderThumb: PropTypes.func.isRequired,
  low: PropTypes.number,
  high: PropTypes.number,
  allowLabelOverflow: PropTypes.bool,
  disableRange: PropTypes.bool,
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  renderLabel: PropTypes.func,
  renderNotch: PropTypes.func,
  renderRail: PropTypes.func.isRequired,
  renderRailSelected: PropTypes.func.isRequired,
  onValueChanged: PropTypes.func,
};

Slider.defaultProps = {
  allowLabelOverflow: false,
  disableRange: false,
  disabled: false,
  floatingLabel: false,
  onValueChanged: noop,
};
const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highThumbContainer: {
    position: 'absolute',
  },
  railsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelFixedContainer: {
    alignItems: 'flex-start',
  },
  labelFloatingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'flex-start',
  },
  touchableArea: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default memo(Slider);
