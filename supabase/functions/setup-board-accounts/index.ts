import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BOARD_ACCOUNTS = [
  { email: "president@ummet.org", name: "د. عبد الله قوني", role: "president" },
  { email: "vice.president@ummet.org", name: "أ. خليل جوربوز", role: "committee-head", committee: "vice-presidency" },
  { email: "media@ummet.org", name: "مريم شاهين", role: "committee-head", committee: "media" },
  { email: "academic@ummet.org", name: "د. عبد الله قوني", role: "committee-head", committee: "academic" },
  { email: "supervisory@ummet.org", name: "أ. خالد أرسلان", role: "committee-head", committee: "supervisory" },
  { email: "activities@ummet.org", name: "م. سلمى أردوغان", role: "committee-head", committee: "activities" },
  { email: "finance@ummet.org", name: "أ. عمر ديمير", role: "committee-head", committee: "finance" },
];

const DEFAULT_PASSWORD = "Aa123456";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const results: { email: string; status: string }[] = [];

    for (const account of BOARD_ACCOUNTS) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: { name: account.name, role: account.role, committee: account.committee ?? null },
      });
      if (error) {
        if (error.message.includes("already") || error.message.includes("exists")) {
          results.push({ email: account.email, status: "already_exists" });
        } else {
          results.push({ email: account.email, status: `error: ${error.message}` });
        }
      } else {
        results.push({ email: account.email, status: "created" });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
