/**
 * In case you'd like to use a different mechanism to make requests
 * these requests are abstracted to allow switching out the service
 */

// Types
// ========================================================
interface UserType {
  id?: string;
  email?: string;
}

// const { data, pagination } = await QUERY_ORGS({
//   query: req?.query?.q as string | undefined,
//   take: req?.query?.take
//     ? (parseInt(req.query.take as string, 0) as number)
//     : undefined,
//   skip: req?.query?.skip
//     ? (parseInt(req.query.skip as string, 0) as number)
//     : undefined,
//   orderBy: req?.query?.orderBy as string | undefined,
//   sort: req?.query?.sort as string | undefined,
//   userId,

interface PayloadType {
  id?: string;
  token?: string;
  q?: string;
  take?: number;
  skip?: number;
  orderBy?: string;
  sort?: string;
  include?: string;
  payload?: {
    [key: string]: any;
  };
}
// interface AuthCred {
//   email: string;
//   password?: string;
// }

// Config
// ========================================================
/**
 *
 */
const API_URI = `${import.meta.env.VITE_API_URL}`;

/**
 *
 */
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 *
 * @param filters
 * @returns
 */
const buildQuery = (filters: Partial<PayloadType>) => {
  let query: any = {};

  if (filters.q) {
    query.q = filters.q;
  }

  if (filters.take) {
    query.take = filters.take;
  }

  if (filters.skip) {
    query.skip = filters.skip;
  }

  if (filters.orderBy) {
    query.orderBy = filters.orderBy;
  }

  if (filters.sort) {
    query.sort = filters.sort;
  }

  if (filters.include) {
    query.include = filters.include;
  }

  const keys = Object.keys(query);

  if (keys.length === 0) return "";

  return `?${keys.map((key) => `${key}=${query[key]}`).join("&")}`;
};

// Requests
// ========================================================
const AUTH = {
  SIGNIN: async ({ id, email }: UserType) => {
    try {
      const result = await fetch(`${API_URI}/auth/signin`, {
        method: "post",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
          id,
          email,
        }),
      });

      const json = await result.json();

      return json?.data ?? json;
    } catch (error) {
      return error;
    }
  },
  RESETPASSWORD: () => {},
};

/**
 *
 */
const USERS = {
  LIST: () => {},
  CREATE: () => {},
  READ: async ({ token, id }: Partial<PayloadType>) => {
    const result = await fetch(`${API_URI}/users/${id}`, {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  UPDATE: async ({ token, id, payload }: Partial<PayloadType>) => {
    const result = await fetch(`${API_URI}/users/${id}`, {
      method: "put",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  DELETE: () => {},
};

/**
 *
 */
const ORGS = {
  LIST: async ({
    token,
    q,
    take,
    skip,
    orderBy,
    sort,
    include,
  }: PayloadType) => {
    try {
      const result = await fetch(
        `${API_URI}/orgs${buildQuery({
          q,
          take,
          skip,
          orderBy,
          sort,
          include,
        })}`,
        {
          headers: {
            ...DEFAULT_HEADERS,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await result.json();

      return json?.data ?? json;
    } catch (error) {
      return error;
    }
  },
  CREATE: async ({ token, payload }: Partial<PayloadType>) => {
    const result = await fetch(`${API_URI}/orgs`, {
      method: "post",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  READ: async ({ token, id }: Partial<PayloadType>) => {
    const result = await fetch(`${API_URI}/orgs/${id}`, {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  UPDATE: async ({ token, id, payload }: Partial<PayloadType>) => {
    const result = await fetch(`${API_URI}/orgs/${id}`, {
      method: "put",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  DELETE: async ({ token, id }: Partial<PayloadType>) => {
    const result = await fetch(`${API_URI}/orgs/${id}`, {
      method: "delete",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
};

/**
 *
 */
const MEMBERS = {
  LIST: async ({
    token,
    id,
    q,
    take,
    skip,
    orderBy,
    sort,
    include,
  }: PayloadType) => {
    const result = await fetch(
      `${API_URI}/orgs/${id}/members${buildQuery({
        q,
        take,
        skip,
        orderBy,
        sort,
        include,
      })}`,
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  CREATE: async ({ token, id, payload }: Partial<PayloadType>) => {
    const result = await fetch(`${API_URI}/orgs/${id}/members`, {
      method: "post",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  READ: () => {},
  UPDATE: async ({ token, id, payload }: Partial<PayloadType>) => {
    const result = await fetch(`${API_URI}/orgs/${id}/members/${payload?.id}`, {
      method: "put",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  DELETE: async ({ token, id, payload }: PayloadType) => {
    const result = await fetch(`${API_URI}/orgs/${id}/members/${payload?.id}`, {
      method: "delete",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
};

const FORMS = {
  LIST: async ({
    token,
    id,
    q,
    take,
    skip,
    orderBy,
    sort,
    include,
  }: PayloadType) => {
    const result = await fetch(
      `${API_URI}/orgs/${id}/forms${buildQuery({
        q,
        take,
        skip,
        orderBy,
        sort,
        include,
      })}`,
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  CREATE: async ({ token, id, payload }: PayloadType) => {
    const result = await fetch(`${API_URI}/orgs/${id}/forms`, {
      method: "post",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  UPDATE: async ({ token, id, payload }: PayloadType) => {
    const result = await fetch(`${API_URI}/orgs/${id}/forms/${payload?.id}`, {
      method: "put",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  DELETE: async ({ token, id, payload }: PayloadType) => {
    const result = await fetch(`${API_URI}/orgs/${id}/forms/${payload?.id}`, {
      method: "delete",
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
};

/**
 *
 */
const HOOKS = {
  LIST: async ({
    token,
    id,
    q,
    take,
    skip,
    orderBy,
    sort,
    include,
  }: PayloadType) => {
    const result = await fetch(
      `${API_URI}/orgs/${id}/hooks${buildQuery({
        q,
        take,
        skip,
        orderBy,
        sort,
        include,
      })}`,
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  CREATE: () => {},
  READ: () => {},
  UPDATE: () => {},
  DELETE: () => {},
};

/**
 *
 */
const PUBLIC_VERIFY = {
  CREATE: async ({ id, payload }: PayloadType) => {
    const result = await fetch(`${API_URI}/public/verify/${id}`, {
      method: "post",
      headers: {
        ...DEFAULT_HEADERS,
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  GET: async ({ id }: PayloadType) => {
    const result = await fetch(`${API_URI}/public/verify/${id}`, {
      headers: {
        ...DEFAULT_HEADERS,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
  SEND: async () => {},
};

/**
 *
 */
const PUBLIC_NONCE = {
  CREATE: async ({ payload }: PayloadType) => {
    const result = await fetch(`${API_URI}/public/nonce`, {
      method: "post",
      headers: {
        ...DEFAULT_HEADERS,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
};

/**
 *
 */
const PUBLIC_ORG = {
  READ: async ({ id }: PayloadType) => {
    const result = await fetch(`${API_URI}/public/orgs/${id}`, {
      headers: {
        ...DEFAULT_HEADERS,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json?.data ?? json;
  },
};

/**
 *
 */
const PUBLIC_ORG_MEMBERS = {
  LIST: async ({ id, q, take, skip, orderBy, sort, include }: PayloadType) => {
    const result = await fetch(
      `${API_URI}/public/orgs/${id}/members${buildQuery({
        q,
        take,
        skip,
        orderBy,
        sort,
        include,
      })}`,
      {
        headers: {
          ...DEFAULT_HEADERS,
        },
      }
    );

    const json = await result.json();

    if (!result.ok) {
      throw new Error(json?.errors?.message || json?.errors || "Unknown error");
    }

    return json;
  },
};

// Exports
// ========================================================
export {
  AUTH,
  USERS,
  ORGS,
  MEMBERS,
  FORMS,
  HOOKS,
  PUBLIC_VERIFY,
  PUBLIC_NONCE,
  PUBLIC_ORG,
  PUBLIC_ORG_MEMBERS,
};
