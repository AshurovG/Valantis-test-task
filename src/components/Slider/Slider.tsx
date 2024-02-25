import React, { useCallback } from "react";
import { useState } from "react";
import Slider from "react-slider";
import debounce from "lodash.debounce";

import "./Slider.scss";

export type SliderProps = {
  minimum: number;
  maximum: number;
  title?: string;
  onChangeValue: (value: number) => void;
};

const SliderFilter: React.FC<SliderProps> = ({
  minimum,
  maximum,
  title,
  onChangeValue,
}) => {
  const [value, setValue] = useState(minimum);

  const onUpdateValue = useCallback(
    debounce((newValue) => {
      onChangeValue(newValue);
    },  1000),
    []
  );

  const handleSliderChange = (newValue: number) => { // Изменено на newValue для одного значения
    setValue(newValue);
    onUpdateValue(newValue);
  };

  return (
    <div className="filter">
      <div className="filter__title">{title}</div>
      <div>
        <div className="filter__range">
          {value}₽
        </div>
        <Slider
          className="filter__slider"
          onChange={handleSliderChange}
          value={value}
          min={minimum}
          max={maximum}
        />
      </div>
    </div>
  );
};

export default SliderFilter;