const axios = require("axios");
const { env } = require("../config/env");

/**
 * Instagram/Meta service layer (future-ready).
 * Keep all external API calls here so controllers stay thin.
 */
class InstagramService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Example helper for future extensions (comment -> DM, auto replies, etc.)
   * Not used yet, but establishes clean boundaries.
   */
  async getMe() {
    if (!env.META_ACCESS_TOKEN) {
      return { configured: false };
    }

    const url = "https://graph.facebook.com/v20.0/me";
    const res = await this.http.get(url, {
      params: { access_token: env.META_ACCESS_TOKEN }
    });
    return res.data;
  }
}

const instagramService = new InstagramService(axios);

module.exports = { InstagramService, instagramService };

