import { NextRequest, NextResponse } from 'next/server';
import { streamDeepSeekResponse } from '@/lib/ai/deepseek-client';
import { buildItineraryPrompt } from '@/lib/ai/prompts';
import { SimpleCache } from '@/lib/utils/cache';
import { WuXingElement } from '@/types/bazi';

interface RequestBody {
  province: string;
  totalDays: number;
  transportMode?: '自驾' | '飞机' | '高铁';
  tripPace?: '特种兵' | '常规' | '休闲';
  xiYongShen?: WuXingElement;
  deficientElements?: WuXingElement[];
  foodTherapyAdvice?: string;
}

const itineraryCache = new SimpleCache<string>(30 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();

    // Validate required fields
    if (!body.province || typeof body.province !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的省份名称' },
        { status: 400 },
      );
    }

    if (
      !body.totalDays ||
      typeof body.totalDays !== 'number' ||
      body.totalDays < 1 ||
      body.totalDays > 14
    ) {
      return NextResponse.json(
        { error: '旅行天数必须在1-14天之间' },
        { status: 400 },
      );
    }

    // Get API key from environment
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI服务未配置，请联系管理员' },
        { status: 500 },
      );
    }

    // Check cache
    const cacheKey = `${body.province}-${body.totalDays}-${body.transportMode || ''}-${body.tripPace || ''}-${body.xiYongShen || ''}-${(body.deficientElements || []).join(',')}`;
    const cached = itineraryCache.get(cacheKey);
    if (cached) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${cached}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Build prompt
    const { system, user } = buildItineraryPrompt({
      province: body.province,
      totalDays: body.totalDays,
      transportMode: body.transportMode,
      tripPace: body.tripPace,
      xiYongShen: body.xiYongShen,
      deficientElements: body.deficientElements,
      foodTherapyAdvice: body.foodTherapyAdvice,
    });

    // Create streaming response
    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = streamDeepSeekResponse(apiKey, {
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
            temperature: 0.7,
            maxTokens: 4096,
          });

          for await (const chunk of generator) {
            fullResponse += chunk;
            controller.enqueue(
              encoder.encode(`data: ${chunk}\n\n`),
            );
          }

          // Cache the complete response
          itineraryCache.set(cacheKey, fullResponse);

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'AI服务请求失败';
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: message })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch {
    return NextResponse.json(
      { error: '请求处理失败' },
      { status: 500 },
    );
  }
}
