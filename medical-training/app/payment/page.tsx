"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { paymentApi } from "@/lib/api"

export default function PaymentPage() {
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success" | "error">("pending")
  const [membershipPlan, setMembershipPlan] = useState<"yearly" | "quarterly" | "monthly">("yearly")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "alipay" | "wechat">("card")
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // 会员计划对应的价格定义
const membershipPrices = {
  yearly: 299,   // 年度会员价格：299元
  quarterly: 99, // 季度会员价格：99元
  monthly: 39    // 月度会员价格：39元
}

// 会员计划对应的描述
const membershipDescriptions = {
  yearly: "年度会员",
  quarterly: "季度会员",
  monthly: "月度会员"
}

// 轮询支付状态 - 每2秒检查一次订单状态
useEffect(() => {
  let intervalId: NodeJS.Timeout | null = null;
  
  // 只在处理中状态且有支付ID时进行轮询
  if (paymentStatus === "processing" && paymentId) {
    intervalId = setInterval(async () => {
      try {
        // 调用后端API检查支付状态
        const response = await paymentApi.checkPaymentStatus(paymentId);
        
        // 数据验证
        if (!response || !response.data || !response.data.data) {
          console.error("支付状态检查返回数据格式错误", response);
          return;
        }
        
        const status = response.data.data.status;
        
        // 支付成功处理
        if (status === "SUCCESS") {
          setPaymentStatus("success");  // 更新支付状态为成功
          clearInterval(intervalId as NodeJS.Timeout);  // 停止轮询
          
          // 更新本地用户信息，添加会员状态
          const userInfo = localStorage.getItem("userInfo");
          if (userInfo) {
            const userData = JSON.parse(userInfo);
            userData.membershipType = membershipPlan;
            userData.membershipExpireDate = response.data.data.expireDate;
            localStorage.setItem("userInfo", JSON.stringify(userData));
          }
          
          // 显示支付成功提示
          toast({
            title: "支付成功",
            description: "您已成功开通会员服务",
            variant: "default",
          });
        } 
        // 支付失败或关闭处理
        else if (status === "FAILED" || status === "CLOSED") {
          setPaymentStatus("error");  // 更新支付状态为错误
          clearInterval(intervalId as NodeJS.Timeout);  // 停止轮询
          toast({
            title: "支付失败",
            description: "请重新尝试支付或选择其他支付方式",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("检查支付状态出错", error);
      }
    }, 2000); // 每2秒检查一次支付状态
  }
  
  // 组件卸载或状态变化时清理定时器
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [paymentStatus, paymentId, membershipPlan, toast]);

// 处理支付按钮点击事件
const handlePayment = async () => {
  try {
    setLoading(true);  // 设置加载状态
    
    // 准备支付数据：金额、会员类型和描述
    const paymentData = {
      amount: String(membershipPrices[membershipPlan]), // 确保金额是字符串格式
      membershipType: membershipPlan.toUpperCase(),     // 转为大写以匹配后端枚举
      description: `医护培训平台${membershipDescriptions[membershipPlan]}订阅`
    };
    
    let response;
    
    // 根据选择的支付方式调用对应的支付API
    if (paymentMethod === "wechat") {
      // 调用微信支付接口
      response = await paymentApi.createWechatPayment(paymentData);
    } else if (paymentMethod === "alipay") {
      // 调用支付宝支付接口
      console.log("正在发起支付宝支付请求...");
      const token = localStorage.getItem('token');
      console.log("当前token状态:", token ? "已获取" : "未获取");
      
      response = await paymentApi.createAlipayPayment(paymentData);
    } else {
      // 银行卡支付(简化处理，直接成功)
      setPaymentStatus("processing");
      setTimeout(() => {
        setPaymentStatus("success");
      }, 2000);
      return;
    }
    
    // 处理支付接口返回结果
    if (response && response.code === 200 && response.data) {
      const responseData = response.data;
      setPaymentId(responseData.paymentId);    // 保存支付ID用于后续查询
      setQrCodeUrl(responseData.qrCodeUrl);    // 设置二维码图片URL
      setPaymentStatus("processing");          // 更新状态为处理中
      
      // 显示提示信息
      toast({
        title: "支付二维码已生成",
        description: `请使用${paymentMethod === "wechat" ? "微信" : "支付宝"}扫描二维码完成支付`,
      });
    } else {
      // 处理错误情况
      throw new Error(response?.message || "创建支付订单失败");
    }
  } catch (error: any) {
    // 错误处理
    console.error("创建支付订单失败", error);
    
    // 详细打印错误信息以便调试
    if (error.response) {
      console.error("错误响应数据:", error.response.data);
      console.error("错误状态码:", error.response.status);
    }
    
    // 判断是否是权限或认证问题
    const errorMsg = error.message || "";
    const isAuthError = 
      errorMsg.includes("token") || 
      errorMsg.includes("认证") || 
      errorMsg.includes("权限") || 
      errorMsg.includes("未登录") ||
      errorMsg.includes("Unauthorized") ||
      errorMsg.includes("403") ||
      errorMsg.includes("401");
    
    toast({
      title: "创建支付订单失败",
      description: isAuthError ? 
        "身份验证失败或已过期，请重新登录后再试" : 
        (error.message || error.response?.data?.message || "请稍后再试"),
      variant: "destructive",
    });
    
    // 如果是认证错误，可以选择性地重定向到登录页
    if (isAuthError) {
      // 可以取消下面的注释来实现自动跳转到登录页
      // router.push('/login');
    }
  } finally {
    setLoading(false);  // 重置加载状态
  }
};

  const handleCancelPayment = async () => {
    if (paymentId) {
      try {
        await paymentApi.cancelPayment(paymentId);
        setPaymentStatus("pending");
        setPaymentId(null);
        setQrCodeUrl(null);
        
        toast({
          title: "支付已取消",
          description: "您可以重新选择支付方式",
        });
      } catch (error) {
        console.error("取消支付失败", error);
      }
    } else {
      setPaymentStatus("pending");
    }
  };

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Link>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">会员支付</h1>
          <p className="text-muted-foreground">完成支付后即可成为正式会员</p>
        </div>

        {paymentStatus === "pending" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>会员套餐</CardTitle>
                <CardDescription>选择适合您的会员套餐</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue="yearly" 
                  className="space-y-4"
                  value={membershipPlan}
                  onValueChange={(value: "yearly" | "quarterly" | "monthly") => setMembershipPlan(value)}
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <div className="flex-1">
                      <Label htmlFor="yearly" className="text-base font-medium">
                        年度会员
                      </Label>
                      <p className="text-sm text-muted-foreground">¥299/年，享受所有会员特权</p>
                    </div>
                    <div className="font-medium">¥299</div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <div className="flex-1">
                      <Label htmlFor="quarterly" className="text-base font-medium">
                        季度会员
                      </Label>
                      <p className="text-sm text-muted-foreground">¥99/季度，享受所有会员特权</p>
                    </div>
                    <div className="font-medium">¥99</div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <div className="flex-1">
                      <Label htmlFor="monthly" className="text-base font-medium">
                        月度会员
                      </Label>
                      <p className="text-sm text-muted-foreground">¥39/月，享受所有会员特权</p>
                    </div>
                    <div className="font-medium">¥39</div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>支付方式</CardTitle>
                <CardDescription>选择您的支付方式</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value as "card" | "alipay" | "wechat")}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">银行卡</TabsTrigger>
                    <TabsTrigger value="alipay">支付宝</TabsTrigger>
                    <TabsTrigger value="wechat">微信支付</TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">卡号</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">有效期</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">安全码</Label>
                        <Input id="cvc" placeholder="CVC" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">持卡人姓名</Label>
                      <Input id="name" placeholder="请输入持卡人姓名" />
                    </div>
                  </TabsContent>
                  <TabsContent value="alipay" className="pt-4">
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <div className="w-40 h-40 bg-muted flex items-center justify-center rounded-lg">
                        <p className="text-center text-sm text-muted-foreground">选择支付宝后会生成支付二维码</p>
                      </div>
                      <p className="text-sm text-muted-foreground">点击支付按钮后会生成支付宝付款码</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="wechat" className="pt-4">
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <div className="w-40 h-40 bg-muted flex items-center justify-center rounded-lg">
                        <p className="text-center text-sm text-muted-foreground">选择微信支付后会生成支付二维码</p>
                      </div>
                      <p className="text-sm text-muted-foreground">点击支付按钮后会生成微信支付二维码</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      支付 ¥{membershipPrices[membershipPlan]}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </>
        )}

        {paymentStatus === "processing" && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              {qrCodeUrl ? (
                <>
                  <div className="mb-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="支付二维码" 
                      className="w-64 h-64 border rounded-lg p-2"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">请扫码支付</h3>
                  <p className="text-muted-foreground mb-4">
                    {paymentMethod === "wechat" ? "请使用微信扫一扫" : "请使用支付宝扫一扫"}
                  </p>
                  <div className="text-sm text-center mb-6 max-w-md">
                    <p className="text-muted-foreground mb-1">
                      金额: <span className="font-medium">¥{membershipPrices[membershipPlan]}</span>
                    </p>
                    <p className="text-muted-foreground mb-3">
                      会员类型: <span className="font-medium">{membershipDescriptions[membershipPlan]}</span>
                    </p>
                    <div className="bg-amber-50 p-3 rounded-md text-amber-800 mb-4">
                      <p className="text-sm">
                        二维码有效期为30分钟，请尽快完成支付。支付成功后页面将自动更新，请勿关闭此页面。
                      </p>
                    </div>
                    
                    {/* 开发环境中模拟支付成功按钮 */}
                    {process.env.NODE_ENV === 'development' && paymentId && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm text-gray-500 mb-2">开发环境模拟支付</p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                // 模拟支付成功
                                const mockResponse = await fetch(`http://localhost:8090/api/payments/${paymentId}/mock-success`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  }
                                });
                                
                                if (mockResponse.ok) {
                                  toast({
                                    title: "模拟支付成功",
                                    description: "已模拟支付成功状态",
                                    variant: "default",
                                  });
                                }
                              } catch (error) {
                                console.error("模拟支付失败", error);
                              }
                            }}
                          >
                            模拟支付成功
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" onClick={handleCancelPayment}>
                    取消支付
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                  <h3 className="text-xl font-bold">正在处理您的支付</h3>
                  <p className="text-muted-foreground">请稍候，不要关闭页面...</p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {paymentStatus === "success" && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="mb-4 rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">支付成功</h3>
              <p className="text-muted-foreground mb-2">您已成功开通会员服务</p>
              <p className="text-sm font-medium mb-6">
                {membershipDescriptions[membershipPlan]} · ¥{membershipPrices[membershipPlan]}
              </p>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <Link href="/courses">浏览课程</Link>
                </Button>
                <Button asChild>
                  <Link href="/">返回首页</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {paymentStatus === "error" && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="mb-4 rounded-full bg-red-100 p-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-red-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">支付失败</h3>
              <p className="text-muted-foreground mb-6">支付过程中遇到问题，请重试</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setPaymentStatus("pending")}>
                  重新支付
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/">返回首页</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
