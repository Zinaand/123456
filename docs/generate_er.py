# -*- coding: utf-8 -*-
"""
生成医护培训平台数据库 ER 图
依赖: pip install graphviz
需要安装 Graphviz 软件: https://graphviz.org/download/
"""

from graphviz import Digraph

dot = Digraph(
    'MedicalTrainingER',
    comment='医护培训平台 ER 图',
    format='png',
    engine='dot'
)

dot.attr(
    rankdir='TB',
    splines='ortho',
    nodesep='0.6',
    ranksep='0.8',
    fontname='Microsoft YaHei',
    fontsize='10',
    label='<<B>医护培训平台 - 完整 ER 图</B>>',
    labelloc='t',
    fontsize='18',
    bgcolor='white',
    pad='0.5'
)

dot.attr('node', fontname='Microsoft YaHei', fontsize='9')
dot.attr('edge', fontname='Microsoft YaHei', fontsize='8', color='#444444')

# ==================== 节点定义 ====================

# 用户表
dot.node('users', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#E3F2FD">
<TR><TD COLSPAN="2" BGCOLOR="#1976D2"><FONT COLOR="white"><B>users</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">用户ID</TD></TR>
<TR><TD ALIGN="LEFT">member_number (UQ)</TD><TD ALIGN="LEFT">会员编号</TD></TR>
<TR><TD ALIGN="LEFT">name</TD><TD ALIGN="LEFT">姓名</TD></TR>
<TR><TD ALIGN="LEFT">phone (UQ)</TD><TD ALIGN="LEFT">手机号</TD></TR>
<TR><TD ALIGN="LEFT">email (UQ)</TD><TD ALIGN="LEFT">邮箱</TD></TR>
<TR><TD ALIGN="LEFT">password</TD><TD ALIGN="LEFT">密码</TD></TR>
<TR><TD ALIGN="LEFT">role</TD><TD ALIGN="LEFT">角色</TD></TR>
<TR><TD ALIGN="LEFT">membership_type</TD><TD ALIGN="LEFT">会员类型</TD></TR>
<TR><TD ALIGN="LEFT">membership_start_date</TD><TD ALIGN="LEFT">会员开始</TD></TR>
<TR><TD ALIGN="LEFT">membership_expire_date</TD><TD ALIGN="LEFT">会员到期</TD></TR>
</TABLE>>''')

# 视频表
dot.node('videos', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#E8F5E9">
<TR><TD COLSPAN="2" BGCOLOR="#388E3C"><FONT COLOR="white"><B>videos</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">视频ID</TD></TR>
<TR><TD ALIGN="LEFT">title</TD><TD ALIGN="LEFT">视频标题</TD></TR>
<TR><TD ALIGN="LEFT">category_id (FK)</TD><TD ALIGN="LEFT">分类ID</TD></TR>
<TR><TD ALIGN="LEFT">instructor_id (FK)</TD><TD ALIGN="LEFT">讲师ID</TD></TR>
<TR><TD ALIGN="LEFT">duration</TD><TD ALIGN="LEFT">时长(秒)</TD></TR>
<TR><TD ALIGN="LEFT">video_url</TD><TD ALIGN="LEFT">视频URL</TD></TR>
<TR><TD ALIGN="LEFT">access_type</TD><TD ALIGN="LEFT">访问类型</TD></TR>
<TR><TD ALIGN="LEFT">views</TD><TD ALIGN="LEFT">观看次数</TD></TR>
</TABLE>>''')

# 讲师表
dot.node('instructors', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#FFF3E0">
<TR><TD COLSPAN="2" BGCOLOR="#F57C00"><FONT COLOR="white"><B>instructors</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">讲师ID</TD></TR>
<TR><TD ALIGN="LEFT">name</TD><TD ALIGN="LEFT">姓名</TD></TR>
<TR><TD ALIGN="LEFT">title</TD><TD ALIGN="LEFT">职称</TD></TR>
<TR><TD ALIGN="LEFT">organization</TD><TD ALIGN="LEFT">所属机构</TD></TR>
<TR><TD ALIGN="LEFT">bio</TD><TD ALIGN="LEFT">个人简介</TD></TR>
</TABLE>>''')

# 视频分类表
dot.node('video_categories', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#F3E5F5">
<TR><TD COLSPAN="2" BGCOLOR="#7B1FA2"><FONT COLOR="white"><B>video_categories</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">分类ID</TD></TR>
<TR><TD ALIGN="LEFT">name</TD><TD ALIGN="LEFT">分类名称</TD></TR>
<TR><TD ALIGN="LEFT">parent_id (FK)</TD><TD ALIGN="LEFT">父分类(自关联)</TD></TR>
</TABLE>>''')

# 视频标签表
dot.node('video_tags', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#FCE4EC">
<TR><TD COLSPAN="2" BGCOLOR="#C2185B"><FONT COLOR="white"><B>video_tags</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">标签ID</TD></TR>
<TR><TD ALIGN="LEFT">name (UQ)</TD><TD ALIGN="LEFT">标签名称</TD></TR>
</TABLE>>''')

# 视频-标签关联表
dot.node('video_tag_relations', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#FCE4EC">
<TR><TD COLSPAN="2" BGCOLOR="#C2185B"><FONT COLOR="white"><B>video_tag_relations</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">video_id (PK,FK)</TD><TD ALIGN="LEFT">视频ID</TD></TR>
<TR><TD ALIGN="LEFT">tag_id (PK,FK)</TD><TD ALIGN="LEFT">标签ID</TD></TR>
</TABLE>>''')

# 会员订阅表
dot.node('subscriptions', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#E1F5FE">
<TR><TD COLSPAN="2" BGCOLOR="#0288D1"><FONT COLOR="white"><B>subscriptions</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">订阅ID</TD></TR>
<TR><TD ALIGN="LEFT">user_id (FK)</TD><TD ALIGN="LEFT">用户ID</TD></TR>
<TR><TD ALIGN="LEFT">plan_type</TD><TD ALIGN="LEFT">订阅类型</TD></TR>
<TR><TD ALIGN="LEFT">start_date</TD><TD ALIGN="LEFT">开始日期</TD></TR>
<TR><TD ALIGN="LEFT">end_date</TD><TD ALIGN="LEFT">结束日期</TD></TR>
<TR><TD ALIGN="LEFT">status</TD><TD ALIGN="LEFT">状态</TD></TR>
<TR><TD ALIGN="LEFT">auto_renew</TD><TD ALIGN="LEFT">自动续费</TD></TR>
</TABLE>>''')

# 支付记录表
dot.node('payments', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#E1F5FE">
<TR><TD COLSPAN="2" BGCOLOR="#0288D1"><FONT COLOR="white"><B>payments</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">支付ID</TD></TR>
<TR><TD ALIGN="LEFT">user_id (FK)</TD><TD ALIGN="LEFT">用户ID</TD></TR>
<TR><TD ALIGN="LEFT">subscription_id (FK)</TD><TD ALIGN="LEFT">订阅ID(可NULL)</TD></TR>
<TR><TD ALIGN="LEFT">amount</TD><TD ALIGN="LEFT">支付金额</TD></TR>
<TR><TD ALIGN="LEFT">payment_method</TD><TD ALIGN="LEFT">支付方式</TD></TR>
<TR><TD ALIGN="LEFT">transaction_id</TD><TD ALIGN="LEFT">交易ID</TD></TR>
<TR><TD ALIGN="LEFT">status</TD><TD ALIGN="LEFT">支付状态</TD></TR>
<TR><TD ALIGN="LEFT">payment_date</TD><TD ALIGN="LEFT">支付时间</TD></TR>
</TABLE>>''')

# 评论表
dot.node('comments', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#E0F2F1">
<TR><TD COLSPAN="2" BGCOLOR="#00796B"><FONT COLOR="white"><B>comments</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">评论ID</TD></TR>
<TR><TD ALIGN="LEFT">user_id (FK)</TD><TD ALIGN="LEFT">用户ID</TD></TR>
<TR><TD ALIGN="LEFT">video_id (FK)</TD><TD ALIGN="LEFT">视频ID</TD></TR>
<TR><TD ALIGN="LEFT">parent_id (FK)</TD><TD ALIGN="LEFT">父评论(自关联)</TD></TR>
<TR><TD ALIGN="LEFT">content</TD><TD ALIGN="LEFT">评论内容</TD></TR>
<TR><TD ALIGN="LEFT">status</TD><TD ALIGN="LEFT">状态</TD></TR>
</TABLE>>''')

# 评分表
dot.node('ratings', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#FBE9E7">
<TR><TD COLSPAN="2" BGCOLOR="#D84315"><FONT COLOR="white"><B>ratings</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">评分ID</TD></TR>
<TR><TD ALIGN="LEFT">user_id (FK)</TD><TD ALIGN="LEFT">用户ID</TD></TR>
<TR><TD ALIGN="LEFT">video_id (FK)</TD><TD ALIGN="LEFT">视频ID</TD></TR>
<TR><TD ALIGN="LEFT">score</TD><TD ALIGN="LEFT">评分(1-5)</TD></TR>
</TABLE>>''')

# 学习资料表
dot.node('materials', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#EFEBE9">
<TR><TD COLSPAN="2" BGCOLOR="#5D4037"><FONT COLOR="white"><B>materials</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">资料ID</TD></TR>
<TR><TD ALIGN="LEFT">video_id (FK)</TD><TD ALIGN="LEFT">视频ID</TD></TR>
<TR><TD ALIGN="LEFT">name</TD><TD ALIGN="LEFT">资料名称</TD></TR>
<TR><TD ALIGN="LEFT">file_url</TD><TD ALIGN="LEFT">文件URL</TD></TR>
<TR><TD ALIGN="LEFT">access_type</TD><TD ALIGN="LEFT">访问类型</TD></TR>
</TABLE>>''')

# 证书表
dot.node('certificates', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#FFF8E1">
<TR><TD COLSPAN="2" BGCOLOR="#F9A825"><FONT COLOR="white"><B>certificates</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">证书ID</TD></TR>
<TR><TD ALIGN="LEFT">user_id (FK)</TD><TD ALIGN="LEFT">用户ID</TD></TR>
<TR><TD ALIGN="LEFT">title</TD><TD ALIGN="LEFT">证书标题</TD></TR>
<TR><TD ALIGN="LEFT">issue_date</TD><TD ALIGN="LEFT">颁发日期</TD></TR>
<TR><TD ALIGN="LEFT">expiry_date</TD><TD ALIGN="LEFT">过期日期</TD></TR>
</TABLE>>''')

# 用户笔记表
dot.node('notes', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#E8EAF6">
<TR><TD COLSPAN="2" BGCOLOR="#3949AB"><FONT COLOR="white"><B>notes</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">笔记ID</TD></TR>
<TR><TD ALIGN="LEFT">user_id (FK)</TD><TD ALIGN="LEFT">用户ID</TD></TR>
<TR><TD ALIGN="LEFT">video_id (FK)</TD><TD ALIGN="LEFT">视频ID</TD></TR>
<TR><TD ALIGN="LEFT">content</TD><TD ALIGN="LEFT">笔记内容</TD></TR>
</TABLE>>''')

# 观看记录表
dot.node('watch_history', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#E8EAF6">
<TR><TD COLSPAN="2" BGCOLOR="#3949AB"><FONT COLOR="white"><B>watch_history</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">记录ID</TD></TR>
<TR><TD ALIGN="LEFT">user_id (FK)</TD><TD ALIGN="LEFT">用户ID</TD></TR>
<TR><TD ALIGN="LEFT">video_id (FK)</TD><TD ALIGN="LEFT">视频ID</TD></TR>
<TR><TD ALIGN="LEFT">progress</TD><TD ALIGN="LEFT">观看进度</TD></TR>
<TR><TD ALIGN="LEFT">completed</TD><TD ALIGN="LEFT">是否完成</TD></TR>
</TABLE>>''')

# 操作日志表
dot.node('operation_logs', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#ECEFF1">
<TR><TD COLSPAN="2" BGCOLOR="#455A64"><FONT COLOR="white"><B>operation_logs</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">日志ID</TD></TR>
<TR><TD ALIGN="LEFT">user_id (FK)</TD><TD ALIGN="LEFT">用户ID(可NULL)</TD></TR>
<TR><TD ALIGN="LEFT">action</TD><TD ALIGN="LEFT">操作类型</TD></TR>
<TR><TD ALIGN="LEFT">target_type</TD><TD ALIGN="LEFT">目标类型</TD></TR>
<TR><TD ALIGN="LEFT">target_id</TD><TD ALIGN="LEFT">目标ID</TD></TR>
</TABLE>>''')

# 系统设置表
dot.node('settings', '''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="#F1F8E9">
<TR><TD COLSPAN="2" BGCOLOR="#558B2F"><FONT COLOR="white"><B>settings</B></FONT></TD></TR>
<TR><TD ALIGN="LEFT"><B>字段</B></TD><TD ALIGN="LEFT"><B>说明</B></TD></TR>
<TR><TD ALIGN="LEFT">id (PK)</TD><TD ALIGN="LEFT">设置ID</TD></TR>
<TR><TD ALIGN="LEFT">setting_key (UQ)</TD><TD ALIGN="LEFT">设置键</TD></TR>
<TR><TD ALIGN="LEFT">setting_value</TD><TD ALIGN="LEFT">设置值</TD></TR>
</TABLE>>''')

# ==================== 关系边 ====================

# 用户 - 订阅 (1:N)
dot.edge('users', 'subscriptions', label='1:N', color='#0288D1', penwidth='1.5')

# 用户 - 支付 (1:N)
dot.edge('users', 'payments', label='1:N', color='#0288D1', penwidth='1.5')

# 订阅 - 支付 (1:N, 可选)
dot.edge('subscriptions', 'payments', label='1:N\n(可选)', style='dashed', color='#0288D1', penwidth='1.2')

# 视频 - 讲师 (N:1)
dot.edge('instructors', 'videos', label='N:1', color='#F57C00', penwidth='1.5')

# 视频 - 分类 (N:1)
dot.edge('video_categories', 'videos', label='N:1', color='#7B1FA2', penwidth='1.5')

# 分类自关联 (1:N)
dot.edge('video_categories', 'video_categories', label='1:N\n(自关联)', style='dashed', color='#7B1FA2', penwidth='1.2')

# 视频 - 评论 (1:N)
dot.edge('videos', 'comments', label='1:N', color='#00796B', penwidth='1.5')

# 用户 - 评论 (1:N)
dot.edge('users', 'comments', label='1:N', color='#00796B', penwidth='1.5')

# 评论自关联 - 回复 (1:N)
dot.edge('comments', 'comments', label='1:N\n(回复)', style='dashed', color='#00796B', penwidth='1.2')

# 视频 - 评分 (1:N)
dot.edge('videos', 'ratings', label='1:N', color='#D84315', penwidth='1.5')

# 用户 - 评分 (1:N)
dot.edge('users', 'ratings', label='1:N', color='#D84315', penwidth='1.5')

# 视频 - 资料 (1:N)
dot.edge('videos', 'materials', label='1:N', color='#5D4037', penwidth='1.5')

# 视频 - 笔记 (1:N)
dot.edge('videos', 'notes', label='1:N', color='#3949AB', penwidth='1.5')

# 用户 - 笔记 (1:N)
dot.edge('users', 'notes', label='1:N', color='#3949AB', penwidth='1.5')

# 视频 - 观看记录 (1:N)
dot.edge('videos', 'watch_history', label='1:N', color='#3949AB', penwidth='1.5')

# 用户 - 观看记录 (1:N)
dot.edge('users', 'watch_history', label='1:N', color='#3949AB', penwidth='1.5')

# 用户 - 证书 (1:N)
dot.edge('users', 'certificates', label='1:N', color='#F9A825', penwidth='1.5')

# 用户 - 操作日志 (1:N)
dot.edge('users', 'operation_logs', label='1:N', color='#455A64', penwidth='1.5')

# 视频 - 标签关联 (1:N)
dot.edge('videos', 'video_tag_relations', label='1:N', color='#C2185B', penwidth='1.5')

# 标签 - 标签关联 (1:N)
dot.edge('video_tags', 'video_tag_relations', label='1:N', color='#C2185B', penwidth='1.5')

# ==================== 布局分组 ====================

# 使用 subgraph 做布局分组
with dot.subgraph() as s:
    s.attr(rank='same')
    s.node('users')
    s.node('settings')

with dot.subgraph() as s:
    s.attr(rank='same')
    s.node('subscriptions')
    s.node('payments')
    s.node('certificates')
    s.node('operation_logs')

with dot.subgraph() as s:
    s.attr(rank='same')
    s.node('instructors')
    s.node('video_categories')
    s.node('video_tags')

with dot.subgraph() as s:
    s.attr(rank='same')
    s.node('videos')

with dot.subgraph() as s:
    s.attr(rank='same')
    s.node('comments')
    s.node('ratings')
    s.node('materials')
    s.node('notes')
    s.node('watch_history')
    s.node('video_tag_relations')

# ==================== 渲染 ====================

output_path = dot.render(
    'd:/Zina/在线课程项目/docs/ER图',
    cleanup=True,
    quiet=False
)

print(f'ER 图已生成: {output_path}')
print(f'如果需要 PDF 版本，可使用 .pdf 后缀重新渲染')
