import { useAtom } from "jotai";
import { useEffect } from "react";

const map = {};

export const useLocalStorage = (name, atom, defaultValue) => {
  const [value, setValue] = useAtom(atom);
  useEffect(() => {
    const storedValue = localStorage[name];

    try {
      let parsedValue;
      try {
        parsedValue = storedValue ? JSON.parse(storedValue) : defaultValue;
      } catch (e) {
        parsedValue = null;
      }
      if (!map[name]) {
        map[name] = true;
        // parsedValue.__initialized = true;
        setValue(parsedValue);
      }
    } catch (e) {
      throw new Error(e);
    }

    return () => {
      map[name] = false;
    };
  }, []);

  const setPersistentValue = (val) => {
    const string = JSON.stringify(val);
    localStorage[name] = string;
    setValue(val);
  };

  return [value, setPersistentValue, setValue];
};
