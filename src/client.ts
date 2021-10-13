import fetch from 'isomorphic-unfetch';

export type ReturnType = {
  data: string | number | [] | any;
  error: string | null;
};
type MethodReturn = Promise<ReturnType>;
type Callback = (res: ReturnType) => any;
type Part = string | boolean | number;
type Bit = 0 | 1;

/**
 * Upstash client
 * @param {string} url - database rest url
 * @param {string} token - database rest token
 */
export default function client(url?: string, token?: string) {
  let baseURL: string = url ?? process.env.UPSTASH_URL ?? '';
  let authToken: string = token ?? process.env.UPSTASH_TOKEN ?? '';

  async function auth(url: string, token: string) {
    baseURL = url;
    authToken = token;
  }

  /**
   * Request
   * @param {function} callback - callback
   * @param {Object} parts - command, key, values, ...
   */
  function request(callback?: Callback, ...parts: Part[]): MethodReturn {
    const promise: Promise<ReturnType> = new Promise((resolve, reject) => {
      return fetch(baseURL, {
        method: 'POST',
        body: JSON.stringify(parts),
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json().then())
        .then((data) => {
          if (data.error) throw data.error;
          resolve({
            data: data.result,
            error: null,
          });
        })
        .catch((error) => {
          resolve({
            data: null,
            error,
          });
        });
    });

    if (callback) {
      return promise.then(callback);
    }

    return promise;
  }

  /*
  ------------------------------------------------
  STRING
  ------------------------------------------------
   */

  function append(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'append', key, value);
  }

  function decr(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'decr', key);
  }

  function decrby(
    key: string,
    decrement: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'decrby', key, decrement);
  }

  function get(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'get', key);
  }

  function getrange(
    key: string,
    start: number,
    end: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'getrange', key, start, end);
  }

  function getset(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'getset', key, value);
  }

  function incr(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'incr', key);
  }

  function incrby(
    key: string,
    value: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'incrby', key, value);
  }

  function incrbyfloat(
    key: string,
    value: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'incrbyfloat', key, value);
  }

  function mget(values: string[], callback?: Callback): MethodReturn {
    return request(callback, 'mget', ...values);
  }

  function mset(values: string[], callback?: Callback): MethodReturn {
    return request(callback, 'mset', ...values);
  }

  function msetnx(values: string[], callback?: Callback): MethodReturn {
    return request(callback, 'msetnx', ...values);
  }

  function psetex(
    key: string,
    miliseconds: number,
    value: string | number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'psetex', key, miliseconds, value);
  }

  function set(
    key: string,
    value: string | number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'set', key, value);
  }

  function setex(
    key: string,
    seconds: number,
    value: string | number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'setex', key, seconds, value);
  }

  function setnx(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'setnx', key, value);
  }

  function setrange(
    key: string,
    offset: number | string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'setrange', key, offset, value);
  }

  function strlen(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'strlen', key);
  }

  /*
  ------------------------------------------------
  BITMAPS
  ------------------------------------------------
   */

  function bitcount(
    key: string,
    start?: number,
    end?: number,
    callback?: Callback
  ): MethodReturn {
    if (start !== undefined && end !== undefined) {
      return request(callback, 'bitcount', key, start, end);
    }
    return request(callback, 'bitcount', key);
  }

  function bitop(
    operation: 'AND' | 'OR' | 'XOR' | 'NOT',
    destinationKey: string,
    sourceKeys: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'bitop', operation, destinationKey, ...sourceKeys);
  }

  function bitpos(
    key: string,
    bit: Bit,
    start?: number,
    end?: number,
    callback?: Callback
  ): MethodReturn {
    if (start !== undefined && end !== undefined) {
      return request(callback, 'bitpos', key, bit, start, end);
    } else if (start !== undefined) {
      return request(callback, 'bitpos', key, bit, start);
    }
    return request(callback, 'bitpos', key, bit);
  }

  function getbit(
    key: string,
    offset: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'getbit', key, offset);
  }

  function setbit(
    key: string,
    offset: number,
    value: Bit,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'setbit', key, offset, value);
  }

  /*
  ------------------------------------------------
  CONNECTION
  ------------------------------------------------
   */

  function echo(value: string, callback?: Callback): MethodReturn {
    return request(callback, 'echo', value);
  }

  function ping(value?: string, callback?: Callback): MethodReturn {
    if (value) {
      return request(callback, 'ping', value);
    }
    return request(callback, 'ping');
  }

  /*
  ------------------------------------------------
  HASHES
  ------------------------------------------------
   */

  function hdel(
    key: string,
    field: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hdel', key, ...field);
  }

  function hexists(
    key: string,
    field: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hexists', key, field);
  }

  function hget(key: string, field: string, callback?: Callback): MethodReturn {
    return request(callback, 'hget', key, field);
  }

  function hgetall(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hgetall', key);
  }

  function hincrby(
    key: string,
    field: string,
    increment: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hincrby', key, field, increment);
  }

  function hincrbyfloat(
    key: string,
    field: string,
    increment: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hincrbyfloat', key, field, increment);
  }

  function hkeys(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hkeys', key);
  }

  function hlen(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hlen', key);
  }

  function hmget(
    key: string,
    fields: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hmget', key, ...fields);
  }

  function hmset(
    key: string,
    values: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hmset', key, ...values);
  }

  function hscan(
    key: string,
    cursor: string,
    opts?: { match?: number | string; count?: number | string },
    callback?: Callback
  ): MethodReturn {
    if (opts?.match && opts?.count) {
      return request(
        callback,
        'hscan',
        key,
        cursor,
        'match',
        opts.match,
        'count',
        opts.count
      );
    } else if (opts?.match) {
      return request(callback, 'hscan', key, cursor, 'match', opts.match);
    } else if (opts?.count) {
      return request(callback, 'hscan', key, cursor, 'count', opts.count);
    }
    return request(callback, 'hscan', key, cursor);
  }

  function hset(
    key: string,
    values: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hset', key, ...values);
  }

  function hsetnx(
    key: string,
    field: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hsetnx', key, field, value);
  }

  function hvals(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hvals', key);
  }

  /*
  ------------------------------------------------
  KEYS
  ------------------------------------------------
   */

  function del(keys: string[], callback?: Callback): MethodReturn {
    return request(callback, 'del', ...keys);
  }

  function exists(key: string[], callback?: Callback): MethodReturn {
    return request(callback, 'exists', ...key);
  }

  function expire(
    key: string,
    seconds: number,
    option?: 'NX' | 'XX' | 'GT' | 'LT',
    callback?: Callback
  ): MethodReturn {
    if (option) {
      return request(callback, 'expire', key, seconds, option);
    }
    return request(callback, 'expire', key, seconds);
  }

  function expireat(
    key: string,
    timestamp: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'expireat', key, timestamp);
  }

  function keys(pattern: string, callback?: Callback): MethodReturn {
    return request(callback, 'keys', pattern);
  }

  function persist(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'persist', key);
  }

  function pexpire(
    key: string,
    miliseconds: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'pexpire', key, miliseconds);
  }

  function pexpireat(
    key: string,
    miliseconds: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'pexpireat', key, miliseconds);
  }

  function pttl(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'pttl', key);
  }

  function randomkey(callback?: Callback): MethodReturn {
    return request(callback, 'randomkey');
  }

  function rename(
    key: string,
    newkey: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'rename', key, newkey);
  }

  function renamenx(
    key: string,
    newkey: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'renamenx', key, newkey);
  }

  function scan(
    cursor: number | string,
    opts?: { match?: number | string; count?: number | string },
    callback?: Callback
  ): MethodReturn {
    if (opts?.match && opts?.count) {
      return request(
        callback,
        'scan',
        cursor,
        'match',
        opts.match,
        'count',
        opts.count
      );
    } else if (opts?.match) {
      return request(callback, 'scan', cursor, 'match', opts.match);
    } else if (opts?.count) {
      return request(callback, 'scan', cursor, 'count', opts.count);
    }
    return request(callback, 'scan', cursor);
  }

  function touch(keys: string[], callback?: Callback): MethodReturn {
    return request(callback, 'touch', ...keys);
  }

  function ttl(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'ttl', key);
  }

  function type(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'type', key);
  }

  function unlink(keys: string[], callback?: Callback): MethodReturn {
    return request(callback, 'unlink', ...keys);
  }

  /*
  ------------------------------------------------
  LISTS
  ------------------------------------------------
   */

  function lindex(
    key: string,
    index: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lindex', key, index);
  }

  function linsert(
    key: string,
    opt: 'BEFORE' | 'AFTER',
    pivot: string,
    element: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'linsert', key, opt, pivot, element);
  }

  function llen(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'llen', key);
  }

  function lpop(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'lpop', key);
  }

  function lpush(
    key: string,
    element: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lpush', key, ...element);
  }

  function lpushx(
    key: string,
    element: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lpushx', key, ...element);
  }

  function lrange(
    key: string,
    start: number,
    stop: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lrange', key, start, stop);
  }

  function lrem(
    key: string,
    count: number,
    element: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lrem', key, count, element);
  }

  function lset(
    key: string,
    index: number,
    element: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lset', key, index, element);
  }

  function ltrim(
    key: string,
    start: number,
    stop: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'ltrim', key, start, stop);
  }

  function rpop(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'rpop', key);
  }

  function rpoplpush(
    source: string,
    destination: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'rpoplpush', source, destination);
  }

  function rpush(
    key: string,
    element: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'rpush', key, ...element);
  }

  function rpushx(
    key: string,
    element: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'rpushx', key, ...element);
  }
  /*
  ------------------------------------------------
  SERVER
  ------------------------------------------------
   */

  function dbsize(callback?: Callback): MethodReturn {
    return request(callback, 'dbsize');
  }

  function flushall(mode?: 'ASYNC', callback?: Callback): MethodReturn {
    if (mode) {
      return request(callback, 'flushall', mode);
    }
    return request(callback, 'flushall');
  }

  function flushdb(mode?: 'ASYNC', callback?: Callback): MethodReturn {
    if (mode) {
      return request(callback, 'flushdb', mode);
    }
    return request(callback, 'flushdb');
  }

  function info(callback?: Callback): MethodReturn {
    return request(callback, 'info');
  }

  function time(callback?: Callback): MethodReturn {
    return request(callback, 'time');
  }

  /*
  ------------------------------------------------
  SET
  ------------------------------------------------
   */

  function sadd(
    key: string,
    member: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'sadd', key, ...member);
  }

  function scard(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'scard', key);
  }

  function sdiff(key: string[], callback?: Callback): MethodReturn {
    return request(callback, 'sdiff', ...key);
  }

  function sdiffstore(
    destination: string,
    key: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'sdiffstore', destination, ...key);
  }

  function sinter(key: string[], callback?: Callback): MethodReturn {
    return request(callback, 'sinter', ...key);
  }

  function sinterstore(
    destination: string,
    key: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'sinterstore', destination, ...key);
  }

  function sismember(
    key: string,
    member: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'sismember', key, member);
  }

  function smembers(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'smembers', key);
  }

  function smove(
    source: string,
    destination: string,
    member: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'smove', source, destination, member);
  }

  function spop(
    key: string,
    count?: number,
    callback?: Callback
  ): MethodReturn {
    if (count) {
      return request(callback, 'spop', key, count);
    }
    return request(callback, 'spop', key);
  }

  function srandmember(
    key: string,
    count?: number,
    callback?: Callback
  ): MethodReturn {
    if (count) {
      return request(callback, 'srandmember', key, count);
    }
    return request(callback, 'srandmember', key);
  }

  function srem(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'srem', key);
  }

  function sscan(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'sscan', key);
  }

  function sunion(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'sunion', key);
  }

  function sunionstore(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'sunionstore', key);
  }

  /*
  ------------------------------------------------
  SORTED SETS
  ------------------------------------------------
   */

  return {
    auth,
    // STRING
    append,
    decr,
    decrby,
    get,
    getrange,
    getset,
    incr,
    incrby,
    incrbyfloat,
    mget,
    mset,
    msetnx,
    psetex,
    set,
    setex,
    setnx,
    setrange,
    strlen,
    // BITMAPS
    bitcount,
    bitop,
    bitpos,
    getbit,
    setbit,
    // CONNECTION
    echo,
    ping,
    //HASHES
    hdel,
    hexists,
    hget,
    hgetall,
    hincrby,
    hincrbyfloat,
    hkeys,
    hlen,
    hmget,
    hmset,
    hset,
    hsetnx,
    hvals,
    hscan,
    // KEYS
    del,
    exists,
    expire,
    expireat,
    keys,
    persist,
    pexpire,
    pexpireat,
    pttl,
    randomkey,
    rename,
    renamenx,
    scan,
    touch,
    ttl,
    type,
    unlink,
    // LIST
    lindex,
    linsert,
    llen,
    lpop,
    lpush,
    lpushx,
    lrange,
    lrem,
    lset,
    ltrim,
    rpop,
    rpoplpush,
    rpush,
    rpushx,
    // SERVER
    dbsize,
    flushall,
    flushdb,
    info,
    time,
    //SET
    sadd,
    scard,
    sdiff,
    sdiffstore,
    sinter,
    sinterstore,
    sismember,
    smembers,
    smove,
    spop,
    srandmember,
    srem,
    sscan,
    sunion,
    sunionstore,
  };
}
