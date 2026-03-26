import { NextResponse } from 'next/server';
import { createPayPalProduct, createMonthlyPlan, createYearlyPlan } from '@/lib/paypal';

export async function GET() {
  try {
    // Create PayPal Product
    const productId = await createPayPalProduct('MailCraftUs Pro');
    console.log('Created product:', productId);

    // Create plans
    const monthlyPlanId = await createMonthlyPlan(productId, '9.00');
    console.log('Created monthly plan:', monthlyPlanId);

    const yearlyPlanId = await createYearlyPlan(productId, '99.00');
    console.log('Created yearly plan:', yearlyPlanId);

    return NextResponse.json({
      success: true,
      productId,
      monthlyPlanId,
      yearlyPlanId,
      message: 'Add these to your environment variables:',
      envVars: {
        PAYPAL_PRODUCT_ID: productId,
        PAYPAL_MONTHLY_PLAN_ID: monthlyPlanId,
        PAYPAL_YEARLY_PLAN_ID: yearlyPlanId,
      },
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Create PayPal Product
    const productId = await createPayPalProduct('MailCraftUs Pro');
    console.log('Created product:', productId);

    // Create plans
    const monthlyPlanId = await createMonthlyPlan(productId, '9.00');
    console.log('Created monthly plan:', monthlyPlanId);

    const yearlyPlanId = await createYearlyPlan(productId, '99.00');
    console.log('Created yearly plan:', yearlyPlanId);

    return NextResponse.json({
      success: true,
      productId,
      monthlyPlanId,
      yearlyPlanId,
      message: 'Add these to your .env.local file:',
      envVars: {
        PAYPAL_PRODUCT_ID: productId,
        PAYPAL_MONTHLY_PLAN_ID: monthlyPlanId,
        PAYPAL_YEARLY_PLAN_ID: yearlyPlanId,
      },
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    );
  }
}
