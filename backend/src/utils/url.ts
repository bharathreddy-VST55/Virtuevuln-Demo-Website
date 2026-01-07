// Taken from PortSwigger's prototype pollution labs
// VULNERABLE TO PROTOTYPE POLLUTION!
const splitUriIntoParamsPPVulnerable = (
  params,
  coerce = undefined
): Record<string, unknown> => {
  if (params.charAt(0) === '?') {
    params = params.substring(1);
  }

  const obj: Record<string, unknown> = {};
  const coerce_types = { true: !0, false: !1, null: null };

  if (!params) {
    return obj;
  }

  params
    .replace(/\+/g, ' ')
    .split('&')
    .forEach(function (v) {
      const param = v.split('=');
      let key = decodeURIComponent(param[0]);
      let keys = key.split('][');
      let keys_last = keys.length - 1;
      let val;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cur: any = obj;
      let i = 0;

      if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
        keys[keys_last] = keys[keys_last].replace(/\]$/, '');
        keys = keys.shift().split('[').concat(keys);
        keys_last = keys.length - 1;
      } else {
        keys_last = 0;
      }

      if (param.length === 2) {
        val = decodeURIComponent(param[1]);

        if (coerce) {
          val =
            val && !isNaN(val) && +val + '' === val
              ? +val // number
              : val === 'undefined'
                ? undefined // undefined
                : coerce_types[val] !== undefined
                  ? coerce_types[val] // true, false, null
                  : val; // string
        }

        if (keys_last) {
          for (; i <= keys_last; i++) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] =
              i < keys_last
                ? cur[key] ||
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (keys[i + 1] && isNaN(keys[i + 1] as any) ? {} : [])
                : val;
          }
        } else {
          if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
            (obj[key] as unknown[]).push(val);
          } else if ({}.hasOwnProperty.call(obj, key)) {
            obj[key] = [obj[key], val];
          } else {
            obj[key] = val;
          }
        }
      } else if (key) {
        obj[key] = coerce ? undefined : '';
      }
    });

  return obj;
};

export default splitUriIntoParamsPPVulnerable;
