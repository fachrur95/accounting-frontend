import type {
  GridSortModel, GridFilterItem, GridFilterModel
} from "@mui/x-data-grid-pro";

export const variantNameShown = (name: string): string => {
  // const splitted = name.split(",");
  return name.replaceAll(",", " ")
}

export const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
    reader.onerror = reject;
  });

export const truncateText = (input: string, max = 45): string => input.length > max ? `${input.substring(0, max)}...` : input;

const codeFormat = "id-ID";

const FormatCurrency = new Intl.NumberFormat(codeFormat, {
  minimumFractionDigits: 0,
  style: 'currency',
  currency: 'IDR',
});

const FormatNumber = new Intl.NumberFormat(codeFormat, {
  minimumFractionDigits: 0,
});

export const formatCurrency = (value: number): string => FormatCurrency.format(value);

export const formatNumber = (value: number): string => FormatNumber.format(value);

export const isJson = (str: string | null): boolean => {
  if (!str) return false;
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const checkNull = (value: string | null): string | null => {
  if (typeof value === "string" && value === "") {
    return null;
  }

  return value;
}

export const checkZero = (value: number | null): number | null => {
  if (typeof value === "number" && isNaN(value)) {
    return 0;
  }

  return value;
}

export const checkNumber = (value?: number | null): number => {
  if (typeof value === "number" && isNaN(value) || !value) {
    return 0;
  }

  return value;
}

export const dateConvert = (date: Date, options?: Intl.DateTimeFormatOptions): string => date.toLocaleString("en-US", options);

export const dateConvertID = (date: Date, options?: Intl.DateTimeFormatOptions): string => date.toLocaleString("id-ID", options);

export const getPublicIdCloudinary = (url: string): string | undefined => {
  const split1 = url.split("/ptnq/")?.[1];
  const split2 = split1?.split(".webp")?.[0];

  return split2 ? `ptnq/${split2}` : split2;
}

export const generateHex = (size = 6): string => {
  const result = [];
  const hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

  for (let n = 0; n < size; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }
  return result.join('');
}

export const isBase64 = (value: string): boolean => {
  const patttern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
  const result = value.match(patttern) ? true : false;

  return result
}

export const isValidUrl = (urlString: string): boolean => {
  let url;
  try {
    url = new URL(urlString);
  }
  catch (e) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export const currentDate = (param = new Date()): string => {
  const date = param.getDate();
  const month = param.getMonth() + 1;
  const year = param.getFullYear();

  return `${year}/${month}/${date}`
}

export const dateID = (param = new Date()): string => {
  const date = param.getDate();
  const month = param.getMonth() + 1;
  const year = param.getFullYear();

  return `${date}/${month}/${year}`
}

export const convertOperator = ({ items }: { items: GridFilterItem[] }) => {
  return items.map((el) => {
    if (
      el.operatorValue === "equals" ||
      el.operatorValue === "="
    ) {
      return { ...el, operatorValue: "equals" };
    }
    if (el.operatorValue === "contains") {
      return { ...el, operatorValue: "contains" };
    }
    if (el.operatorValue === "isAnyOf") {
      return { ...el, operatorValue: "in" };
    }
    if (el.operatorValue === "isNotEmpty") {
      return { ...el, operatorValue: "not", value: null };
    }
    if (el.operatorValue === "isEmpty") {
      return { ...el, operatorValue: undefined, value: null };
    }
    if (
      el.operatorValue === "isNot" ||
      el.operatorValue === "not" ||
      el.operatorValue === "!="
    ) {
      return { ...el, operatorValue: "not" };
    }
    if (
      el.operatorValue === "isAfter" ||
      el.operatorValue === "after" ||
      el.operatorValue === ">"
    ) {
      return { ...el, operatorValue: "gt" };
    }
    if (
      el.operatorValue === "is" ||
      el.operatorValue === "isOnOrAfter" ||
      el.operatorValue === "onOrAfter" ||
      el.operatorValue === ">="
    ) {
      return { ...el, operatorValue: "gte" };
    }
    if (
      el.operatorValue === "isBefore" ||
      el.operatorValue === "before" ||
      el.operatorValue === "<"
    ) {
      return { ...el, operatorValue: "lt" };
    }
    if (
      el.operatorValue === "isOnOrBefore" ||
      el.operatorValue === "onOrBefore" ||
      el.operatorValue === "<="
    ) {
      return { ...el, operatorValue: "lte" };
    }
    return el;
  });
};

export const convertDateOnly = (val: number) => {
  return new Date(val).toLocaleString("id-ID", { dateStyle: "long" });

  // return `${date.getMonth() + 1}/${date.getDay()}/${date.getFullYear()}`;
};

export const convertFilterToURL = (filter: GridFilterModel, front: "&" | "?" = "&") => {
  let url = `${front}filters[operator]=${filter.linkOperator ?? "or"}`;

  filter.items.forEach((field, index) => {
    url += `&filters[fields][${index}][field]=${field.columnField}`;
    if (field.operatorValue) {
      url += `&filters[fields][${index}][type]=${field.operatorValue}`;
    }
    url += `&filters[fields][${index}][value]=${field.value}`;
  });

  return url;
}

export const convertSortToURL = (sorts: GridSortModel, front: "&" | "?" = "&") => {
  let url = `${front}`;

  sorts.forEach((row, index) => {
    url += `&sorts[${index}][field]=${row.field}`;
    url += `&sorts[${index}][sort]=${row.sort}`;
  });

  return url;
}

export const imageUrlToFile = async (imageUrl: string, filename: string): Promise<File | null> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const blob = await response.blob();

    return new File([blob], filename);
  } catch (error) {
    console.error("Gagal mengunduh dan mengonversi URL gambar ke objek File:", error);
    return null;
  }
}

export const abbreviateNumber = (value: number): string => {
  let newValue = value.toString();
  if (value >= 1000) {
    const suffixes = ["", "k", "jt", "m", "t"];
    const suffixNum = Math.floor(value.toString().length / 3);
    let shortValue = "";
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision)).toString();
      const dotLessShortValue = (shortValue.toString()).replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (parseFloat(shortValue) % 1 !== 0) shortValue = parseFloat(shortValue).toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }

  return newValue;
}

export const abbreviateNumberLib = (value: number): string => {
  return Intl.NumberFormat('id-ID', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value)
}

export const toTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}