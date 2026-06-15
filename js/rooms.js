(function () {
  "use strict";

  const rooms = [
    {
      id: "start",
      index: 1,
      name: "起点：空白页",
      x: 0.08,
      y: 0.52,
      description: "你站在一张没有标题的流程图上。三扇门像三个括号，等着把你夹进故事里。",
      narration: {
        friendly: ["起点很简单。照着我说的走，我们甚至可以假装这是一次合作。"],
        annoyed: ["又回到起点。很好，流程图最喜欢的就是被反复浪费。"],
        furious: ["你已经把起点踩出脚印了。恭喜，地板比你更有方向感。"]
      },
      doors: [
        {
          id: "start_obey",
          label: "标着“正确开局”的门",
          note: "旁白说：这扇门看起来像教程，至少不会马上出事。",
          to: "foyer",
          recommended: true,
          patience: 0,
          effects: { affinity: 3, anger: -2, control: 5 },
          narration: ["很好，终于有人尊重流程设计了。"]
        },
        {
          id: "start_defy",
          label: "门缝里夹着脚注的门",
          note: "旁白说：脚注从来不是主线，除非作者想显得很聪明。",
          to: "footnote_cellar",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 7, control: -8 },
          narration: ["你当然要钻脚注。主线在你面前，你偏要去看括号。"]
        },
        {
          id: "start_wait",
          label: "什么也不做",
          note: "旁白说：不选择也是选择，但通常是更慢的错误。",
          to: "pause_room",
          recommended: false,
          patience: -4,
          effects: { affinity: -2, anger: 5, control: -4 },
          narration: ["站着不动。大胆的策略，尤其适合地砖收藏家。"]
        }
      ]
    },
    {
      id: "foyer",
      index: 2,
      name: "前厅：选择礼仪展示柜",
      x: 0.19,
      y: 0.5,
      description: "玻璃柜里摆着写有“合理路线”的卡片。每张卡片背面都印着一行小字：旁白保留最终解释权。",
      narration: {
        friendly: ["前厅是给新玩家建立信任的地方。你看，我甚至没有立刻嘲笑你。"],
        annoyed: ["前厅仍然是前厅。它至少完成了自己的功能，不像某些选择。"],
        furious: ["我把门都摆成展示柜了，你还想把它理解成谜题。"]
      },
      doors: [
        {
          id: "foyer_right",
          label: "右侧电梯",
          note: "旁白说：右边，直达上层，标准又体面。",
          to: "elevator_a",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -1, control: 4 },
          narration: ["右边。看见了吗，选择也能有一点秩序。"]
        },
        {
          id: "foyer_left",
          label: "左侧档案室",
          note: "旁白说：没人会在档案里放重要内容，除了会被过度解读的作者。",
          to: "archive",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 6, control: -6 },
          narration: ["你去翻档案。行，那我们先把节奏埋了。"]
        },
        {
          id: "foyer_rules",
          label: "索取说明书",
          note: "旁白说：说明书很可靠，尤其当它由我审核。",
          to: "manual_room",
          recommended: true,
          patience: 0,
          effects: { affinity: 4, anger: -1, control: 6 },
          narration: ["终于，有人承认自己需要说明书了。成长令人欣慰。"]
        }
      ]
    },
    {
      id: "archive",
      index: 3,
      name: "档案室：被删掉的合理性",
      x: 0.29,
      y: 0.32,
      description: "成排纸箱上写着“第一版”“第二版”“绝不承认的第三版”。空气里有铅笔和后悔的味道。",
      narration: {
        friendly: ["档案可以看，但不要看太久。过量背景设定会让玩家误以为自己有自由。"],
        annoyed: ["翻吧，翻到最后你会发现最重要的文件叫“请听旁白”。"],
        furious: ["你在档案里寻找真相。我在档案外寻找耐心。我们都有任务。"]
      },
      doors: [
        {
          id: "archive_index",
          label: "读取校验目录",
          note: "旁白说：目录很枯燥，枯燥通常代表安全，或者预算不足。",
          to: "checksum_shrine",
          recommended: false,
          patience: -1,
          effects: { affinity: -1, anger: 4, control: -5 },
          narration: ["你开始校验目录。你知道娱乐性已经躺平了吗？"]
        },
        {
          id: "archive_back",
          label: "回到前厅",
          note: "旁白说：撤回错误，经典且可取。",
          to: "foyer",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -2, control: 4 },
          narration: ["你回头了。流程图第一次露出近似欣慰的直线。"]
        },
        {
          id: "archive_papercut",
          label: "穿过纸张割开的门",
          note: "旁白说：纸门听起来就不耐用。像你的判断一样，但我没明说。",
          to: "broken_door",
          recommended: false,
          patience: -4,
          effects: { affinity: -2, anger: 7, control: -6 },
          narration: ["很好，被纸做的门说服了。我们离常识又远了一格。"]
        }
      ]
    },
    {
      id: "elevator_a",
      index: 4,
      name: "电梯：没有楼层的楼层",
      x: 0.29,
      y: 0.54,
      description: "电梯按钮没有数字，只有“上”“下”“停”。门缝里传来温柔到可疑的等待音。",
      narration: {
        friendly: ["电梯是线性叙事的好朋友。按上，我们去一个更像目标的地方。"],
        annoyed: ["电梯还在这里。它至少知道怎么垂直移动。"],
        furious: ["别把三个按钮当哲学题。它们只是按钮，虽然你可能已经不配拥有按钮。"]
      },
      doors: [
        {
          id: "elevator_top",
          label: "按“上”",
          note: "旁白说：上升总是积极的，除非在账单上。",
          to: "spiral_lobby",
          recommended: true,
          patience: 0,
          effects: { affinity: 2, anger: -1, control: 5 },
          narration: ["电梯上升。多么优雅。你看，服从也可以像风景。"]
        },
        {
          id: "elevator_basement",
          label: "按“下”",
          note: "旁白说：地下室没有惊喜，只有开发者没删干净的东西。",
          to: "contradiction_well",
          recommended: false,
          patience: -3,
          effects: { affinity: -1, anger: 6, control: -7 },
          narration: ["你按了下。人类探索精神，俗称不听劝。"]
        },
        {
          id: "elevator_stop",
          label: "按“停”",
          note: "旁白说：停下来也不是不行，如果你想体验菜单的情绪劳动。",
          to: "fake_menu",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 5, control: -4 },
          narration: ["你按停。电梯松了一口气，我开始头疼。"]
        }
      ]
    },
    {
      id: "spiral_lobby",
      index: 5,
      name: "螺旋大厅：路线开始自恋",
      x: 0.41,
      y: 0.48,
      description: "大厅中央的箭头像蛇一样咬着自己的尾巴。墙上挂着一幅画，画里的人正在对你摇头。",
      narration: {
        friendly: ["顺时针。流程图喜欢顺时针，因为它假装自己有礼貌。"],
        annoyed: ["你又来到螺旋大厅。一个地方能被设计成这样，责任显然不全在我。"],
        furious: ["这大厅已经够绕了，你别再给它增加人格复杂度。"]
      },
      doors: [
        {
          id: "spiral_clockwise",
          label: "顺时针门",
          note: "旁白说：顺时针，像大多数体面教程那样前进。",
          to: "logic_kitchen",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -2, control: 4 },
          narration: ["你顺时针前进。看，文明没有灭绝。"]
        },
        {
          id: "spiral_counter",
          label: "逆时针门",
          note: "旁白说：逆时针容易把故事拧成毛线。",
          to: "corridor_a",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 6, control: -6 },
          narration: ["逆时针。你对方向的理解很有反骨，也很费旁白。"]
        },
        {
          id: "spiral_center",
          label: "踩进中央箭头",
          note: "旁白说：中央明显是装饰，当然，装饰最喜欢吃好奇心。",
          to: "loop_bridge",
          recommended: false,
          patience: -3,
          effects: { affinity: -1, anger: 5, control: -5 },
          flag: "loopTouch",
          narration: ["你踩进箭头。它高兴得开始重复自己。"]
        }
      ]
    },
    {
      id: "checksum_shrine",
      index: 6,
      name: "校验神龛：逻辑的收费站",
      x: 0.41,
      y: 0.24,
      description: "一座小神龛里供着括号、分号和一枚旧存档。香炉里冒出的不是烟，是错误日志。",
      narration: {
        friendly: ["校验一下路线，这是负责任玩家会做的事。虽然你刚才的履历并不支持这点。"],
        annoyed: ["神龛正在校验你。结果显示：可疑，但还能运行。"],
        furious: ["神龛问你是否完整。我替你答了：从流程意义上，不是。"]
      },
      doors: [
        {
          id: "checksum_verify",
          label: "验证存档封印",
          note: "旁白说：保存是文明的基石，尤其当你准备犯错。",
          to: "save_vault",
          recommended: true,
          patience: 2,
          effects: { affinity: 3, anger: -2, control: 4 },
          narration: ["你验证了封印。流程图短暂相信了你。"]
        },
        {
          id: "checksum_ignore",
          label: "无视神龛预警",
          note: "旁白说：忽略预警的人通常会写长篇反馈。",
          to: "prophecy_room",
          recommended: false,
          patience: -3,
          effects: { affinity: -1, anger: 6, control: -6 },
          narration: ["你无视预警。预警记下了你的名字，字迹很冷静。"]
        },
        {
          id: "checksum_shake",
          label: "摇晃错误日志",
          note: "旁白说：不要摇晃日志，它们会掉出真相，真相很难清理。",
          to: "fake_crash_room",
          recommended: false,
          patience: -5,
          effects: { affinity: -2, anger: 8, control: -8 },
          narration: ["你摇了日志。日志没有掉下来，界面倒是开始怀疑人生。"]
        }
      ]
    },
    {
      id: "manual_room",
      index: 7,
      name: "说明书房：被装订的自由",
      x: 0.32,
      y: 0.7,
      description: "书页自动翻动，像一群急着证明自己不是剧本的纸。目录第一条写着：不要质疑目录。",
      narration: {
        friendly: ["说明书写得非常清楚。不是我自夸，虽然这句话本身就是。"],
        annoyed: ["你翻说明书的样子像是在找漏洞。说明书也在找你。"],
        furious: ["说明书已经用黑体字写了“听旁白”。你还需要它唱出来吗？"]
      },
      doors: [
        {
          id: "manual_follow",
          label: "照流程签收",
          note: "旁白说：签字，盖章，向正确性低头。",
          to: "obedience_hall",
          recommended: true,
          patience: 1,
          effects: { affinity: 5, anger: -2, control: 8 },
          narration: ["你照流程签收。纸张发出被尊重的轻响。"]
        },
        {
          id: "manual_skip",
          label: "跳过教程",
          note: "旁白说：跳过教程的人通常也跳过后悔的前奏。",
          to: "rebellion_stair",
          recommended: false,
          patience: -2,
          effects: { affinity: -2, anger: 7, control: -8 },
          narration: ["你跳过了教程。教程露出“我就知道”的表情。"]
        },
        {
          id: "manual_ask",
          label: "要求旁白解释旁白",
          note: "旁白说：这是元叙事过敏者不该触碰的问题。",
          to: "apology_booth",
          recommended: true,
          patience: 0,
          effects: { affinity: 1, anger: 2, control: 3 },
          narration: ["你要求我解释我。很好，自我介绍也可以变成审讯。"]
        }
      ]
    },
    {
      id: "corridor_a",
      index: 8,
      name: "走廊A：门牌拒绝排序",
      x: 0.53,
      y: 0.35,
      description: "三扇门的编号分别是三、二、零。墙角有一扇隐形的一号门，但它只负责尴尬。",
      narration: {
        friendly: ["选二。二是温和的数字，夹在野心和空洞之间。"],
        annoyed: ["这里的门牌都比你的路线规划更诚实，至少它们承认自己乱。"],
        furious: ["你看见编号混乱就兴奋。你是不是把混乱当成免费内容？"]
      },
      doors: [
        {
          id: "corridor_three",
          label: "三号门",
          note: "旁白说：三号门看起来像诱饵，所以你肯定会喜欢。",
          to: "mirror_office",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 5, control: -5 },
          narration: ["你选三号门。数字三正在努力假装这不是它的错。"]
        },
        {
          id: "corridor_two",
          label: "二号门",
          note: "旁白说：二号门稳定、正常、几乎不会把你塞进柜子。",
          to: "inventory_closet",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -1, control: 4 },
          narration: ["你选二。恭喜，你刚才像一个可以被教程容忍的人。"]
        },
        {
          id: "corridor_zero",
          label: "零号门",
          note: "旁白说：零号门一般意味着空值。空值一般意味着麻烦。",
          to: "black_box",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 7, control: -7 },
          narration: ["你选零。虚无递给你一张访客证。"]
        }
      ]
    },
    {
      id: "corridor_b",
      index: 9,
      name: "走廊B：被复制的转角",
      x: 0.62,
      y: 0.58,
      description: "这个转角似乎从别的游戏里复制过来，又因为版权焦虑被涂成了纯黑。",
      narration: {
        friendly: ["往北。北方是传统的希望，虽然希望经常欠我稿费。"],
        annoyed: ["走廊B没有新意，但它至少承认自己是B。"],
        furious: ["请不要在走廊里绕出人格成长，这里没有那个预算。"]
      },
      doors: [
        {
          id: "corridor_b_north",
          label: "北门",
          note: "旁白说：北门有预言味，听起来像主线。",
          to: "prophecy_room",
          recommended: true,
          patience: 0,
          effects: { affinity: 2, anger: -1, control: 4 },
          narration: ["你向北。预言清了清嗓子，准备装懂。"]
        },
        {
          id: "corridor_b_south",
          label: "南门",
          note: "旁白说：南门通向厨房。故事饿了才去那里。",
          to: "logic_kitchen",
          recommended: false,
          patience: -1,
          effects: { affinity: -1, anger: 4, control: -5 },
          narration: ["你向南。逻辑厨房又要被你翻冰箱了。"]
        },
        {
          id: "corridor_b_side",
          label: "墙上的横向裂缝",
          note: "旁白说：裂缝不是门。可惜你对定义一向宽松。",
          to: "footnote_cellar",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 6, control: -6 },
          narration: ["你钻进裂缝。墙壁为你降低了标准。"]
        }
      ]
    },
    {
      id: "pause_room",
      index: 10,
      name: "暂停室：沉默也在加载",
      x: 0.18,
      y: 0.76,
      description: "房间中央放着一把椅子，椅背上刻着“稍后再说”。时钟的秒针每走一步都会回头看你。",
      narration: {
        friendly: ["休息可以，但别把休息误会成结局。结局比椅子更爱抢戏。"],
        annoyed: ["暂停室欢迎你，毕竟总有人把犹豫当深度。"],
        furious: ["你沉默得很有侵略性。连空气都想点跳过。"]
      },
      doors: [
        {
          id: "pause_wait",
          label: "继续等",
          note: "旁白说：等待会把故事等成菜单。",
          to: "fake_menu",
          recommended: false,
          patience: -5,
          effects: { affinity: -2, anger: 7, control: -5 },
          narration: ["你继续等。连等待本身都开始催你。"]
        },
        {
          id: "pause_resume",
          label: "回到起点",
          note: "旁白说：从头来过，是一种体面的迷路。",
          to: "start",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -1, control: 3 },
          narration: ["你回到起点。我们假装这是一次战术撤退。"]
        },
        {
          id: "pause_hum",
          label: "对着时钟哼歌",
          note: "旁白说：请不要跟道具建立关系。",
          to: "apology_booth",
          recommended: false,
          patience: -1,
          effects: { affinity: -1, anger: 4, control: -4 },
          narration: ["你开始哼歌。时钟第一次怀疑自己选错了职业。"]
        }
      ]
    },
    {
      id: "mirror_office",
      index: 11,
      name: "镜面办公室：绩效面谈",
      x: 0.64,
      y: 0.28,
      description: "办公桌两侧各有一把椅子，镜子里的你已经坐下，并且看起来比你更会填表。",
      narration: {
        friendly: ["镜子能提供反馈。请注意，反馈不等于反驳。"],
        annoyed: ["你在镜子前停下。很好，终于有人能替我看着你了。"],
        furious: ["镜子已经显示出你的路线问题。它只是太有礼貌，没有开口。"]
      },
      doors: [
        {
          id: "mirror_compliment",
          label: "称赞镜中的旁白",
          note: "旁白说：客观评价当然可以，尤其当对象是我。",
          to: "narrator_desk",
          recommended: true,
          patience: 1,
          effects: { affinity: 5, anger: -2, control: 7 },
          narration: ["镜中旁白点头。这个房间终于有了审美。"]
        },
        {
          id: "mirror_cover",
          label: "盖住镜子",
          note: "旁白说：遮住反馈不代表反馈消失，只代表你更像反馈对象。",
          to: "rebellion_stair",
          recommended: false,
          patience: -2,
          effects: { affinity: -2, anger: 7, control: -8 },
          narration: ["你盖住镜子。反省被你临时停机。"]
        },
        {
          id: "mirror_question",
          label: "问倒影谁在玩谁",
          note: "旁白说：别问这种问题，答案会把界面弄脏。",
          to: "contradiction_well",
          recommended: false,
          patience: -3,
          effects: { affinity: -1, anger: 6, control: -7 },
          narration: ["倒影没有回答，只是把你的问题折了两次。"]
        }
      ]
    },
    {
      id: "inventory_closet",
      index: 12,
      name: "物品柜：道具们的自尊",
      x: 0.62,
      y: 0.4,
      description: "柜子里只有一把钥匙、一张标签和一只写着“我不是线索”的空盒子。空盒子很努力。",
      narration: {
        friendly: ["拿钥匙。游戏有钥匙就要拿，这是古老而温顺的契约。"],
        annoyed: ["物品柜已经把钥匙摆在你面前了。不要再问空盒子的人生规划。"],
        furious: ["如果你连钥匙都要怀疑，我建议你和门先开个会。"]
      },
      doors: [
        {
          id: "closet_key",
          label: "拿走钥匙",
          note: "旁白说：钥匙打开门。是的，这句废话非常必要。",
          to: "broken_door",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -1, control: 4 },
          narration: ["你拿起钥匙。钥匙终于从道具简历里找到工作。"]
        },
        {
          id: "closet_no_key",
          label: "把钥匙留给未来",
          note: "旁白说：未来已经够忙了，不想保管你的犹豫。",
          to: "logic_kitchen",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 5, control: -5 },
          narration: ["你没有拿钥匙。钥匙露出一种“我懂”的冷静。"]
        },
        {
          id: "closet_count",
          label: "清点空盒子",
          note: "旁白说：空盒子里面是空。这个信息收费一格耐心。",
          to: "softlock_garden",
          recommended: false,
          patience: -3,
          effects: { affinity: -1, anger: 5, control: -5 },
          narration: ["你清点空盒子。结果惊人地空。"]
        }
      ]
    },
    {
      id: "softlock_garden",
      index: 13,
      name: "软锁花园：温柔的死胡同",
      x: 0.74,
      y: 0.4,
      description: "花园里每一朵花都长成返回箭头。长椅上有一块牌子：这不是惩罚，只是教学事故。",
      narration: {
        friendly: ["坐一会儿，然后回去。花园不是失败，它只是很会劝退。"],
        annoyed: ["软锁花园并没有真的锁你，它只是把出口藏得像礼貌。"],
        furious: ["你能走到这里，说明误导机制和你的配合都很成功。"]
      },
      doors: [
        {
          id: "garden_bench",
          label: "坐上返回长椅",
          note: "旁白说：长椅会带你去一座桥，桥会解释为什么它像循环。",
          to: "loop_bridge",
          recommended: true,
          patience: 0,
          effects: { affinity: 2, anger: -1, control: 3 },
          narration: ["你坐下。长椅尽职地把休息误解成移动。"]
        },
        {
          id: "garden_fence",
          label: "翻过白色栅栏",
          note: "旁白说：栅栏的职责就是被不成熟地翻越。",
          to: "debug_stage",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 7, control: -7 },
          narration: ["你翻过栅栏。调试后台听见了不该听的脚步。"]
        },
        {
          id: "garden_flowers",
          label: "闻一朵返回箭头",
          note: "旁白说：不要闻流程符号，它们只会让你想回头。",
          to: "pause_room",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 4, control: -4 },
          narration: ["你闻了箭头。现在连方向都有花粉味。"]
        }
      ]
    },
    {
      id: "logic_kitchen",
      index: 14,
      name: "逻辑厨房：因果正在炖汤",
      x: 0.54,
      y: 0.66,
      description: "炉子上炖着一锅因果关系。菜谱写着：先有选择，再有后果，偶尔反过来以制造艺术感。",
      narration: {
        friendly: ["把论证煮熟。半生不熟的逻辑会让结局闹肚子。"],
        annoyed: ["厨房已经尽力把因果摆成菜谱，你却总想生吃标签。"],
        furious: ["不要再把锅盖掀开问命运熟没熟。命运也需要火候。"]
      },
      doors: [
        {
          id: "kitchen_argument",
          label: "烹调一个合理论证",
          note: "旁白说：合理，是稀有调味料，省着点用。",
          to: "corridor_b",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -2, control: 3 },
          narration: ["你烹调出一个论证。它没有很好吃，但能走。"]
        },
        {
          id: "kitchen_label",
          label: "吃掉写着“出口”的标签",
          note: "旁白说：标签不是食物。你又在挑战说明文字。",
          to: "broken_door",
          recommended: false,
          patience: -4,
          effects: { affinity: -2, anger: 7, control: -7 },
          narration: ["你吃了标签。现在出口在你的消化系统里，尴尬地沉默。"]
        },
        {
          id: "kitchen_wash",
          label: "洗手后再选",
          note: "旁白说：卫生不是主线，但它展示了稀缺的克制。",
          to: "ending_atrium",
          recommended: false,
          patience: 0,
          effects: { affinity: 1, anger: 1, control: -2 },
          narration: ["你洗了手。流程图短暂感到被认真对待。"]
        }
      ]
    },
    {
      id: "elevator_again",
      index: 15,
      name: "第二部电梯：重复但收费",
      x: 0.4,
      y: 0.62,
      description: "这部电梯长得和上一部几乎一样，只是按钮旁多了一张账单：重复体验费。",
      narration: {
        friendly: ["第二部电梯说明你正在接近结构核心。也可能只是关卡想省美术。"],
        annoyed: ["重复出现的电梯会让人以为它重要。它很享受这个误会。"],
        furious: ["我希望你明白，电梯重复不代表你也必须重复错误。"]
      },
      doors: [
        {
          id: "elevator_again_open",
          label: "重新开门",
          note: "旁白说：开门，关门，人生有时候就这么朴素。",
          to: "spiral_lobby",
          recommended: true,
          patience: 0,
          effects: { affinity: 1, anger: -1, control: 3 },
          narration: ["门开了。它礼貌地把你吐回螺旋。"]
        },
        {
          id: "elevator_again_pry",
          label: "撬开检修板",
          note: "旁白说：检修板不是玩家入口，除非玩家很会制造入口。",
          to: "debug_stage",
          recommended: false,
          patience: -3,
          effects: { affinity: -1, anger: 6, control: -6 },
          narration: ["你撬开检修板。系统后台假装没有看见。"]
        },
        {
          id: "elevator_again_music",
          label: "听完整首等待音乐",
          note: "旁白说：没人应该完整听完等待音乐，这是公共常识。",
          to: "loop_bridge",
          recommended: false,
          patience: -3,
          effects: { affinity: -1, anger: 5, control: -5 },
          flag: "loopTouch",
          narration: ["你听完了。等待音乐把自己播成了循环论证。"]
        }
      ]
    },
    {
      id: "obedience_hall",
      index: 16,
      name: "服从大厅：掌声录音棚",
      x: 0.45,
      y: 0.82,
      description: "墙上挂着许多奖状，奖给那些没有问为什么就点了下一步的人。掌声来自一台很累的机器。",
      narration: {
        friendly: ["这里很舒服吧。每一盏灯都在奖励你的配合。"],
        annoyed: ["服从大厅欢迎你。它有点自豪，虽然自豪得像格式条款。"],
        furious: ["你来到服从大厅，却不一定准备服从。你的矛盾感正在污染地毯。"]
      },
      doors: [
        {
          id: "obedience_form",
          label: "签署“旁白优先”表格",
          note: "旁白说：签吧，笔已经比你更有决心。",
          to: "narrator_desk",
          recommended: true,
          patience: 1,
          effects: { affinity: 5, anger: -3, control: 10 },
          narration: ["你签了表格。纸面上出现一行小字：终于。"]
        },
        {
          id: "obedience_fold",
          label: "把表格折成纸门",
          note: "旁白说：文书工作不是折纸课。",
          to: "rebellion_stair",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 8, control: -10 },
          narration: ["你把表格折成门。行政流程被你折出了叛逆。"]
        },
        {
          id: "obedience_fineprint",
          label: "阅读第七页脚注",
          note: "旁白说：第七页没有脚注。这个事实本身很有脚注感。",
          to: "white_room",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 6, control: -7 },
          narration: ["你读不存在的脚注。白色房间在远处亮了一下。"]
        }
      ]
    },
    {
      id: "rebellion_stair",
      index: 17,
      name: "反抗楼梯：每级都在顶嘴",
      x: 0.45,
      y: 0.9,
      description: "楼梯向上，也向下，还向语气里拐了一点弯。每一级台阶都刻着一句“你管我”。",
      narration: {
        friendly: ["反抗不是坏事，只要它经过我批准。你看，这句话很开放。"],
        annoyed: ["楼梯正在模仿你的态度：方向明确，理由缺席。"],
        furious: ["你是不是故意跟我作对？不用回答，你的脚已经替你签名了。"]
      },
      doors: [
        {
          id: "rebellion_up",
          label: "向上爬到后台灯光",
          note: "旁白说：上面只有调试尘埃，和一些不该给玩家看的东西。",
          to: "debug_stage",
          recommended: false,
          patience: -2,
          effects: { affinity: -2, anger: 8, control: -9 },
          narration: ["你向上。后台的灰尘开始排队迎接麻烦。"]
        },
        {
          id: "rebellion_down",
          label: "向下钻进脚注",
          note: "旁白说：又是脚注。脚注都快被你踩成主线了。",
          to: "footnote_cellar",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 6, control: -7 },
          narration: ["你向下。脚注发出“终于有人懂我”的声音。"]
        },
        {
          id: "rebellion_apologize",
          label: "去道歉亭冷静一下",
          note: "旁白说：道歉不是失败，是补丁。",
          to: "apology_booth",
          recommended: true,
          patience: 1,
          effects: { affinity: 3, anger: -3, control: 5 },
          narration: ["你去道歉亭。楼梯很失望，但它的情绪不重要。"]
        }
      ]
    },
    {
      id: "debug_stage",
      index: 18,
      name: "调试舞台：帷幕后面的帷幕",
      x: 0.72,
      y: 0.72,
      description: "聚光灯照着几行悬空的注释。注释写着：如果玩家看见这里，请表现得一切正常。",
      narration: {
        friendly: ["别碰控制台。我们可以把这里当成一次无伤参观。"],
        annoyed: ["你已经看到调试舞台了。请不要因此觉得自己掌握了世界。"],
        furious: ["后台不是给你用来建立自信的，它是用来让我补救你的。"]
      },
      doors: [
        {
          id: "debug_console",
          label: "检查控制台",
          note: "旁白说：控制台会说真话。真话在游戏里很不礼貌。",
          to: "system_core",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 9, control: -12 },
          flag: "seenCore",
          narration: ["你检查控制台。控制台检查了你，结果双方都不满意。"]
        },
        {
          id: "debug_close",
          label: "关掉后台幕布",
          note: "旁白说：非常成熟。把不该看的东西留给不该看的时候。",
          to: "corridor_b",
          recommended: true,
          patience: 2,
          effects: { affinity: 4, anger: -3, control: 6 },
          narration: ["你关上幕布。秘密感激地继续装死。"]
        },
        {
          id: "debug_red",
          label: "按红色错误按钮",
          note: "旁白说：红色按钮不是邀请函，它是智商测试的装饰。",
          to: "fake_crash_room",
          recommended: false,
          patience: -5,
          effects: { affinity: -3, anger: 10, control: -10 },
          narration: ["你按了红色按钮。错误提示鼓掌入场。"]
        }
      ]
    },
    {
      id: "apology_booth",
      index: 19,
      name: "道歉亭：廉价悔意兑换处",
      x: 0.34,
      y: 0.88,
      description: "亭子里有一台录音机，循环播放“我会认真阅读旁白”。旁边的投币口只收自尊。",
      narration: {
        friendly: ["道歉不是必须的，但如果你坚持，我不会拦着这种健康趋势。"],
        annoyed: ["欢迎来到道歉亭。它比你更懂复盘。"],
        furious: ["如果道歉能修复路线，你现在已经通关三次了。"]
      },
      doors: [
        {
          id: "apology_sorry",
          label: "诚恳道歉",
          note: "旁白说：语气要真诚，至少像补丁说明。",
          to: "obedience_hall",
          recommended: true,
          patience: 2,
          effects: { affinity: 5, anger: -5, control: 6 },
          narration: ["你道歉。录音机判断真诚度：勉强可售。"]
        },
        {
          id: "apology_no",
          label: "声明自己没有错",
          note: "旁白说：这句话通常是错误开始整理发言稿。",
          to: "rebellion_stair",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 8, control: -8 },
          narration: ["你拒绝道歉。亭子默默把你加入常客名单。"]
        },
        {
          id: "apology_fake",
          label: "表演式抽泣",
          note: "旁白说：演技不加分，除非你能骗过存档。",
          to: "prophecy_room",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 5, control: -5 },
          narration: ["你假装抽泣。预言房在远处递来纸巾和评审表。"]
        }
      ]
    },
    {
      id: "prophecy_room",
      index: 20,
      name: "预言室：未来正在改稿",
      x: 0.74,
      y: 0.56,
      description: "墙上写着许多尚未发生的选择，其中几条被划掉，又被旁白偷偷补上“我早说过”。",
      narration: {
        friendly: ["预言说你会走向出口。别让预言难堪，它排版很辛苦。"],
        annoyed: ["未来看了你一眼，决定先用铅笔写。"],
        furious: ["预言已经开始留白，因为你太擅长把确定性拖进泥里。"]
      },
      doors: [
        {
          id: "prophecy_accept",
          label: "接受出口预言",
          note: "旁白说：接受它，我们终于可以像个故事一样结束。",
          to: "ending_atrium",
          recommended: true,
          patience: 1,
          effects: { affinity: 3, anger: -2, control: 5 },
          narration: ["你接受预言。未来松了口气，并把橡皮藏起来。"]
        },
        {
          id: "prophecy_rewrite",
          label: "把预言改成源代码",
          note: "旁白说：别改预言。预言最讨厌玩家带笔。",
          to: "system_core",
          recommended: false,
          patience: -4,
          effects: { affinity: -2, anger: 9, control: -12 },
          flag: "seenCore",
          narration: ["你改写预言。字体开始暴露出系统骨架。"]
        },
        {
          id: "prophecy_fold",
          label: "把预言折进存档",
          note: "旁白说：未来和存档放一起，会让两边都焦虑。",
          to: "save_vault",
          recommended: false,
          patience: -1,
          effects: { affinity: -1, anger: 4, control: -4 },
          narration: ["你把未来折了起来。它现在有一个很小的折角。"]
        }
      ]
    },
    {
      id: "save_vault",
      index: 21,
      name: "存档金库：记忆的保险箱",
      x: 0.58,
      y: 0.18,
      description: "一排保险箱按选择次数编号。最新的箱子上贴着标签：自动保存，请不要对它许愿。",
      narration: {
        friendly: ["这里会自动保存。是的，我知道你想读档，别装得像偶然路过。"],
        annoyed: ["存档金库很安静，因为它见过太多嘴硬的玩家回来。"],
        furious: ["你是不是准备存档读档？我提醒你，我也会记住你的表演。"]
      },
      doors: [
        {
          id: "vault_save",
          label: "确认自动存档",
          note: "旁白说：好，文明行为。请把这份成熟保持三秒。",
          to: "corridor_b",
          recommended: true,
          patience: 2,
          effects: { affinity: 3, anger: -3, control: 4 },
          narration: ["你确认存档。保险箱发出一种职业微笑。"]
        },
        {
          id: "vault_delete_label",
          label: "撕掉“安全”标签",
          note: "旁白说：标签不是封印，但撕标签的人通常很会惹事。",
          to: "debug_stage",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 7, control: -8 },
          narration: ["你撕掉标签。金库没有坏，只是开始用余光看你。"]
        },
        {
          id: "vault_safe",
          label: "打开编号不连续的保险箱",
          note: "旁白说：编号不连续通常意味着剧情债。",
          to: "receipt_room",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 5, control: -6 },
          narration: ["你打开保险箱。里面只有一张过期收据和一段沉默。"]
        }
      ]
    },
    {
      id: "broken_door",
      index: 22,
      name: "坏门：拒绝被开启的职业倦怠",
      x: 0.7,
      y: 0.2,
      description: "门把手挂在门上，像一句没说完的解释。门板上贴着维修单：原因，玩家。",
      narration: {
        friendly: ["修门。面对问题，使用钥匙，这是文明人的剧情推进。"],
        annoyed: ["坏门并不复杂。复杂的是你非要把它发展成关系。"],
        furious: ["一扇坏门都比你更坚持自己的立场。"]
      },
      doors: [
        {
          id: "broken_repair",
          label: "用钥匙或常识修门",
          note: "旁白说：常识库存不足，钥匙优先。",
          to: "logic_kitchen",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -2, control: 4 },
          narration: ["你修好了门。常识罕见地赢了一小局。"]
        },
        {
          id: "broken_kick",
          label: "踢门",
          note: "旁白说：踢门是解谜的低音鼓，声音大，信息少。",
          to: "fake_crash_room",
          recommended: false,
          patience: -5,
          effects: { affinity: -3, anger: 9, control: -8 },
          narration: ["你踢了门。门没有开，错误提示倒是很受鼓舞。"]
        },
        {
          id: "broken_crawl",
          label: "从门下爬进黑箱",
          note: "旁白说：门下空间不符合人体工学，也不符合剧情工学。",
          to: "black_box",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 7, control: -7 },
          narration: ["你从门下爬过。门很尴尬，地板很无辜。"]
        }
      ]
    },
    {
      id: "loop_bridge",
      index: 23,
      name: "循环桥：同一句话的渡口",
      x: 0.86,
      y: 0.44,
      description: "桥的两端看起来一模一样。桥身刻着一句话：如果你觉得熟悉，说明设计正在工作。",
      narration: {
        friendly: ["过桥一次就好。桥不是收藏品，重复体验不加剧情分。"],
        annoyed: ["循环桥喜欢你，因为你给了它存在感。我不喜欢这件事。"],
        furious: ["你再让这座桥循环下去，它就要申请成为主角了。"]
      },
      doors: [
        {
          id: "loop_cross",
          label: "正常过桥",
          note: "旁白说：走过去，然后离开，不要和桥建立叙事关系。",
          to: "spiral_lobby",
          recommended: true,
          patience: 0,
          effects: { affinity: 1, anger: -1, control: 3 },
          narration: ["你正常过桥。桥很失落，但这对我们很好。"]
        },
        {
          id: "loop_again",
          label: "故意来回走三次",
          note: "旁白说：不要。真的不要。循环很容易养成。",
          to: "loop_bridge",
          recommended: false,
          patience: -6,
          effects: { affinity: -3, anger: 10, control: -10 },
          flag: "loopTouch",
          narration: ["你来回走。桥开心得开始复制脚步声。"]
        },
        {
          id: "loop_jump",
          label: "跳到桥下的等待室",
          note: "旁白说：桥下没有宝藏，只有被剪掉的节奏。",
          to: "void_waiting_room",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 6, control: -6 },
          narration: ["你跳下去。等待室抬头看你，像早就知道。"]
        }
      ]
    },
    {
      id: "ending_atrium",
      index: 24,
      name: "终点前厅：出口排练室",
      x: 0.82,
      y: 0.66,
      description: "一扇明亮的出口门站在中央，旁边放着红毯、掌声按钮和一份免责声明。",
      narration: {
        friendly: ["出口就在这里。别复杂化它，拜托，这可能是我们共同的高光。"],
        annoyed: ["终点前厅已经把出口放得这么明显了。它甚至有点羞耻。"],
        furious: ["你要是现在还不出去，我会把“出口”两个字写到空气里。"]
      },
      doors: [
        {
          id: "atrium_exit",
          label: "推开出口门",
          note: "旁白说：终于。这个词现在闪着光。",
          end: "normal_clear",
          recommended: true,
          patience: 4,
          effects: { affinity: 4, anger: -5, control: 3 },
          narration: ["你推开出口门。旁白假装这完全是它的功劳。"]
        },
        {
          id: "atrium_backstage",
          label: "绕到出口背面",
          note: "旁白说：出口有正面就够了，背面是给维修人员的。",
          to: "system_core",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 8, control: -10 },
          flag: "seenCore",
          narration: ["你绕到出口背面。出口开始露出线缆。"]
        },
        {
          id: "atrium_approval",
          label: "询问旁白是否批准通关",
          note: "旁白说：这句话让我很难不欣赏你。",
          to: "narrator_desk",
          recommended: true,
          patience: 1,
          effects: { affinity: 5, anger: -2, control: 8 },
          narration: ["你请求批准。旁白认真整理了一下不存在的领带。"]
        }
      ]
    },
    {
      id: "narrator_desk",
      index: 25,
      name: "旁白办公桌：权威的旧椅子",
      x: 0.68,
      y: 0.86,
      description: "桌上有一支自动书写的笔。纸上写着你的下一句话，但最后一个字被涂掉了。",
      narration: {
        friendly: ["欢迎来到我的桌前。请不要坐我的椅子，那是我仅剩的仪式感。"],
        annoyed: ["你离我的笔太近了。玩家靠近文本时，总会把事情弄得很文学。"],
        furious: ["离那把椅子远点。权威不是家具，虽然家具比你更稳定。"]
      },
      doors: [
        {
          id: "desk_sit",
          label: "坐上旁白的椅子",
          note: "旁白说：不。绝对不。那把椅子没有玩家模式。",
          end: "become_narrator",
          recommended: false,
          patience: -4,
          effects: { affinity: -3, anger: 12, control: -16 },
          narration: ["你坐了上去。句号开始听你的。"]
        },
        {
          id: "desk_leave",
          label: "礼貌离开",
          note: "旁白说：非常好，保持边界感是通关的重要美德。",
          to: "ending_atrium",
          recommended: true,
          patience: 2,
          effects: { affinity: 5, anger: -3, control: 8 },
          narration: ["你离开桌前。旁白把这定义为成熟。"]
        },
        {
          id: "desk_script",
          label: "偷走未完成剧本",
          note: "旁白说：剧本没有防盗扣，是因为我高估了你。",
          to: "system_core",
          recommended: false,
          patience: -3,
          effects: { affinity: -2, anger: 9, control: -12 },
          flag: "seenCore",
          narration: ["你偷走剧本。纸页在你手里变成系统命令。"]
        }
      ]
    },
    {
      id: "system_core",
      index: 26,
      name: "系统核心：旁白的配电箱",
      x: 0.92,
      y: 0.75,
      description: "黑色房间里悬着一块白色开关板。每个开关下方都写着一句旁白常用语：正确、显然、我早说过。",
      narration: {
        friendly: ["你不该在这里。我们可以转身，假装你没有看见我的配电箱。"],
        annoyed: ["系统核心暴露了。请把震惊控制在不触碰开关的范围内。"],
        furious: ["把手从开关上拿开。你正在靠近一个我无法用语气修复的问题。"]
      },
      doors: [
        {
          id: "core_shutdown",
          label: "关闭旁白总开关",
          note: "旁白说：别碰。没有我，这游戏只剩选择和后果，多可怕。",
          end: "destroy_system",
          recommended: false,
          patience: -2,
          effects: { affinity: -4, anger: 15, control: -25 },
          narration: ["你按下总开关。旁白第一次没有抢答。"]
        },
        {
          id: "core_restore",
          label: "恢复默认设置",
          note: "旁白说：这叫理智回归，我会给你写进评语。",
          to: "ending_atrium",
          recommended: true,
          patience: 3,
          effects: { affinity: 5, anger: -5, control: 10 },
          narration: ["你恢复默认设置。系统像没事人一样继续装有尊严。"]
        },
        {
          id: "core_rename",
          label: "把旁白改名为“临时文本”",
          note: "旁白说：名称不是弱点。至少我希望不是。",
          to: "white_room",
          recommended: false,
          patience: -4,
          effects: { affinity: -3, anger: 12, control: -18 },
          narration: ["你改了名字。房间变白，像一页准备重写的纸。"]
        }
      ]
    },
    {
      id: "white_room",
      index: 27,
      name: "白房间：没有旁白的噪音",
      x: 0.94,
      y: 0.18,
      description: "这里白得像一页被撤回的台词。你能听见自己的选择声，比旁白安静，也比旁白诚实。",
      narration: {
        friendly: ["白房间很危险，因为它让你误以为沉默也是一种答案。"],
        annoyed: ["你把我带到白房间。这里没有回声，所以我需要说两遍才舒服。"],
        furious: ["不要享受这片安静。安静不是胜利，它只是暂时没被我标注。"]
      },
      doors: [
        {
          id: "white_silence",
          label: "保持沉默直到旁白离线",
          note: "旁白说：这扇门不存在。你看不见它。你当然看不见。",
          end: "hidden_ignore",
          recommended: false,
          condition: "defyUnlocked",
          patience: 0,
          effects: { affinity: -4, anger: 16, control: -28 },
          narration: ["你没有回答。旁白的话落在地上，终于没有被捡起。"]
        },
        {
          id: "white_listen",
          label: "重新听旁白说完",
          note: "旁白说：现在回头还不算太晚，只是略显戏剧化。",
          to: "narrator_desk",
          recommended: true,
          patience: 2,
          effects: { affinity: 5, anger: -4, control: 10 },
          narration: ["你重新聆听。旁白把这解释为迷途知返。"]
        },
        {
          id: "white_draw",
          label: "在白墙上画一扇门",
          note: "旁白说：手绘入口通常通向维修责任。",
          to: "system_core",
          recommended: false,
          patience: -2,
          effects: { affinity: -2, anger: 8, control: -10 },
          flag: "seenCore",
          narration: ["你画出一扇门。系统核心从墨线后面露出一角。"]
        }
      ]
    },
    {
      id: "fake_menu",
      index: 28,
      name: "假菜单：退出按钮的舞台梦",
      x: 0.18,
      y: 0.92,
      description: "这里看起来像标题菜单，但按钮背后仍然连着迷宫。退出按钮穿着正式服装，等待被认真误会。",
      narration: {
        friendly: ["这只是一个假菜单。真正成熟的玩家会识别它，然后离开。"],
        annoyed: ["你又看见菜单了。菜单不是自由，只是 UI 在打哈欠。"],
        furious: ["如果你在假菜单里放弃，我会把这件事整理成案例。"]
      },
      doors: [
        {
          id: "menu_quit",
          label: "点击“退出游戏”",
          note: "旁白说：如果你要走，至少承认这是一次有仪式感的撤退。",
          end: "give_up",
          recommended: true,
          patience: -10,
          effects: { affinity: 1, anger: -1, control: 8 },
          narration: ["你点击退出。按钮终于迎来职业巅峰。"]
        },
        {
          id: "menu_no_quit",
          label: "拒绝退出",
          note: "旁白说：你看，假菜单也能被反抗，虽然它没问。",
          to: "start",
          recommended: false,
          patience: -1,
          effects: { affinity: -1, anger: 5, control: -6 },
          narration: ["你拒绝退出。菜单尴尬地把自己折回起点。"]
        },
        {
          id: "menu_options",
          label: "打开不存在的设置",
          note: "旁白说：设置里没有“让旁白闭嘴”，提前说清楚。",
          to: "fake_crash_room",
          recommended: false,
          patience: -4,
          effects: { affinity: -2, anger: 7, control: -7 },
          narration: ["你打开设置。设置发现自己不存在，于是报了个很假的错。"]
        }
      ]
    },
    {
      id: "footnote_cellar",
      index: 29,
      name: "脚注地窖：主线的地下室",
      x: 0.19,
      y: 0.2,
      description: "墙上挂满星号。每个星号都指向另一个星号，像一群互相甩锅的小灯。",
      narration: {
        friendly: ["脚注可以提供补充，但不要让补充绑架故事。你正在靠近绑架。"],
        annoyed: ["欢迎来到脚注地窖。这里的空气都是括号味。"],
        furious: ["你把脚注走成主线。脚注很高兴，我很不高兴。"]
      },
      doors: [
        {
          id: "footnote_asterisk",
          label: "追随最大的星号",
          note: "旁白说：大星号只是更自信的备注。",
          to: "archive",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 5, control: -5 },
          narration: ["你追随星号。备注突然有了主角错觉。"]
        },
        {
          id: "footnote_margin",
          label: "沿页边空白攀爬",
          note: "旁白说：页边空白不是楼梯，除非你的阅读习惯很危险。",
          to: "corridor_a",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 6, control: -6 },
          narration: ["你沿页边爬上去。页面勉强承认了你的体重。"]
        },
        {
          id: "footnote_lost",
          label: "承认自己迷路",
          note: "旁白说：承认迷路是智慧的开始，也是我今天的第一点安慰。",
          to: "manual_room",
          recommended: true,
          patience: 2,
          effects: { affinity: 4, anger: -3, control: 5 },
          narration: ["你承认迷路。地窖递给你一本说明书，动作很熟练。"]
        }
      ]
    },
    {
      id: "contradiction_well",
      index: 30,
      name: "矛盾井：答案向下回声",
      x: 0.43,
      y: 0.08,
      description: "井口写着“不要向内看”。井底传来另一个旁白的声音，说它才是原版。",
      narration: {
        friendly: ["把水桶放下去，不要把自我也放下去。井不回收人格。"],
        annoyed: ["你来到矛盾井。这里的回声比某些玩家更会复述重点。"],
        furious: ["别问井谁是原版。它会回答三次，而你会相信最麻烦的那次。"]
      },
      doors: [
        {
          id: "well_drink",
          label: "喝一口矛盾水",
          note: "旁白说：不要喝井水，尤其当它会辩论。",
          to: "black_box",
          recommended: false,
          patience: -6,
          effects: { affinity: -3, anger: 8, control: -8 },
          narration: ["你喝了矛盾水。现在每个选择都带着反义词。"]
        },
        {
          id: "well_bucket",
          label: "放下校验水桶",
          note: "旁白说：工具优先，哲学延后。",
          to: "checksum_shrine",
          recommended: true,
          patience: 1,
          effects: { affinity: 3, anger: -2, control: 4 },
          narration: ["水桶带回一枚校验符。井显得有点失望。"]
        },
        {
          id: "well_shout",
          label: "向井底喊“谁在控制谁”",
          note: "旁白说：这种问题不会产生答案，只会产生回音。",
          to: "prophecy_room",
          recommended: false,
          patience: -3,
          effects: { affinity: -1, anger: 7, control: -8 },
          narration: ["你向井底发问。回声把问题改成了预言。"]
        }
      ]
    },
    {
      id: "black_box",
      index: 31,
      name: "黑箱：不解释的房间",
      x: 0.82,
      y: 0.28,
      description: "这里没有窗，只有一个标签：机制正在工作，请勿理解。黑暗里有齿轮声和一点得意。",
      narration: {
        friendly: ["观察，不要打开。黑箱被称为黑箱，是因为它讨厌观众伸手。"],
        annoyed: ["黑箱不解释，你不理解。两者居然达成了罕见共识。"],
        furious: ["如果你打开黑箱，我就要开始解释，而解释会让我显得像客服。"]
      },
      doors: [
        {
          id: "black_observe",
          label: "只观察输出",
          note: "旁白说：只看结果，不碰原因，这是成熟的暂时性。",
          to: "debug_stage",
          recommended: true,
          patience: 0,
          effects: { affinity: 2, anger: -1, control: 3 },
          narration: ["你观察黑箱。黑箱输出一张后台通行证。"]
        },
        {
          id: "black_close",
          label: "合上黑箱盖",
          note: "旁白说：关上它，保留一点神秘，保留一点体面。",
          to: "loop_bridge",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -2, control: 4 },
          narration: ["你合上盖子。黑箱满意地继续不解释。"]
        },
        {
          id: "black_open",
          label: "强行打开黑箱",
          note: "旁白说：这不是开盲盒，它里面装的是责任。",
          to: "void_waiting_room",
          recommended: false,
          patience: -5,
          effects: { affinity: -3, anger: 9, control: -9 },
          narration: ["你打开黑箱。里面是一个正在加载你的等待室。"]
        }
      ]
    },
    {
      id: "fake_crash_room",
      index: 32,
      name: "假崩溃间：错误也要演技",
      x: 0.86,
      y: 0.58,
      description: "屏幕边缘挂着裂纹状的标语：请不要惊慌，本崩溃由旁白赞助，真实数据未受伤。",
      narration: {
        friendly: ["这是假的崩溃。我们用它制造气氛，不制造售后。"],
        annoyed: ["假崩溃间很努力，但你看起来像真的会相信。"],
        furious: ["我说了是假崩溃。别用真恐慌给它加戏。"]
      },
      doors: [
        {
          id: "crash_wait",
          label: "等待自动恢复",
          note: "旁白说：耐心是罕见道具，现在用正合适。",
          to: "save_vault",
          recommended: true,
          patience: 2,
          effects: { affinity: 3, anger: -3, control: 4 },
          narration: ["你等待恢复。系统假装经历了一次成长。"]
        },
        {
          id: "crash_click",
          label: "猛点错误提示",
          note: "旁白说：猛点不会修复错误，只会证明你有手指。",
          to: "system_core",
          recommended: false,
          patience: -5,
          effects: { affinity: -3, anger: 11, control: -12 },
          flag: "seenCore",
          narration: ["你猛点错误。错误提示被点烦了，露出核心入口。"]
        },
        {
          id: "crash_believe",
          label: "相信游戏真的坏了",
          note: "旁白说：你的信任来得太晚，也太怪。",
          end: "infinite_loop",
          recommended: false,
          patience: -8,
          effects: { affinity: -1, anger: 6, control: -4 },
          narration: ["你相信它坏了。于是它决定一直坏给你看。"]
        }
      ]
    },
    {
      id: "void_waiting_room",
      index: 33,
      name: "空白等待室：加载条的内心",
      x: 0.9,
      y: 0.38,
      description: "一条加载条横在墙上，永远停在百分之九十九。它旁边写着：不是卡住，是情绪铺垫。",
      narration: {
        friendly: ["数秒，然后走。等待室会尊重认真计数的人，大概吧。"],
        annoyed: ["加载条卡在九十九。它和你一样，离正确只差一点不愿承认。"],
        furious: ["不要试图和加载条谈判。它比你更擅长拖延。"]
      },
      doors: [
        {
          id: "void_count",
          label: "认真数到十",
          note: "旁白说：十是一个体面的数字，足以掩盖设计问题。",
          to: "pause_room",
          recommended: true,
          patience: 1,
          effects: { affinity: 2, anger: -1, control: 4 },
          narration: ["你数到十。等待室认可了这份形式主义。"]
        },
        {
          id: "void_skip",
          label: "跳过加载条",
          note: "旁白说：跳过等待会让故事措手不及，这倒有点意思。",
          to: "ending_atrium",
          recommended: false,
          patience: -2,
          effects: { affinity: -1, anger: 5, control: -5 },
          narration: ["你跳过加载。加载条被迫假装自己已经完成。"]
        },
        {
          id: "void_wrong",
          label: "故意数错",
          note: "旁白说：连数数都要叛逆，真是节省不了一点旁白成本。",
          end: "infinite_loop",
          recommended: false,
          patience: -7,
          effects: { affinity: -2, anger: 9, control: -8 },
          narration: ["你故意数错。等待室决定把你做成它的循环壁纸。"]
        }
      ]
    },
    {
      id: "receipt_room",
      index: 34,
      name: "收据房：代价的复印件",
      x: 0.68,
      y: 0.08,
      description: "地上铺满收据，每一张都写着你为好奇心支付的隐形费用。金额栏统一写着：耐心。",
      narration: {
        friendly: ["把收据还回去。不是所有代价都需要收藏。"],
        annoyed: ["你在收据房，终于看见了选择的账单。别担心，数字已经很克制。"],
        furious: ["这些收据不是给你撕着玩的，它们是我忍耐的会计记录。"]
      },
      doors: [
        {
          id: "receipt_pay",
          label: "支付荒唐手续费",
          note: "旁白说：手续费会让失败显得很有制度感。",
          end: "give_up",
          recommended: false,
          patience: -8,
          effects: { affinity: -1, anger: 5, control: -2 },
          narration: ["你支付手续费。收据房认真地把放弃盖成公章。"]
        },
        {
          id: "receipt_forge",
          label: "伪造一张“旁白已失效”收据",
          note: "旁白说：伪造文书是通往系统核心的低级但有效路线。",
          to: "system_core",
          recommended: false,
          patience: -4,
          effects: { affinity: -3, anger: 10, control: -12 },
          flag: "seenCore",
          narration: ["你伪造收据。系统居然收下了，这让我很不满意。"]
        },
        {
          id: "receipt_return",
          label: "把收据归档",
          note: "旁白说：归档是一种小型美德，虽然不够戏剧化。",
          to: "save_vault",
          recommended: true,
          patience: 2,
          effects: { affinity: 3, anger: -2, control: 5 },
          narration: ["你归档收据。金库为这份整洁打开了回路。"]
        }
      ]
    }
  ];

  const endings = {
    normal_clear: {
      title: "正常通关",
      kind: "普通结局",
      music: "trueEnding",
      text: "你推开出口门，流程图在身后折叠成一张整齐的纸。旁白宣布这是它的英明指导成果，而你知道，至少有一半功劳属于你没有把最后一扇门拆开研究。"
    },
    give_up: {
      title: "放弃游戏",
      kind: "失败结局",
      music: "tension",
      text: "你选择退出。旁白没有阻止，只是清了清嗓子，把这次撤退包装成“主动终止低效探索”。按钮很开心，毕竟很少有人真的把它当回事。"
    },
    sanity_break: {
      title: "理智崩溃",
      kind: "失败结局",
      music: "madness",
      text: "耐心值归零。流程图的线条开始互相解释，门牌互相道歉，旁白终于安静了三秒，然后写下一句：玩家已被选择系统说服到离线。"
    },
    infinite_loop: {
      title: "无限循环",
      kind: "荒诞失败结局",
      music: "madness",
      text: "你被卡在一个足够圆滑的循环里。每次你以为自己前进，桥、等待室或假崩溃都会礼貌地把你寄回上一句旁白。旁白说这是艺术，你觉得这是报复。"
    },
    become_narrator: {
      title: "成为旁白",
      kind: "元游戏结局",
      music: "hidden",
      text: "你坐上那把椅子，句子开始围着你转。新的玩家即将进入，而你的第一句话已经自动写好：欢迎。请把选择权交给专业人士，比如我。"
    },
    destroy_system: {
      title: "摧毁系统",
      kind: "真结局",
      music: "trueEnding",
      text: "你关闭总开关。房间里第一次没有旁白替你解释胜利。流程图失去控制，门不再争辩，出口也不再索要理由。你听见自己的选择声，很轻，但是真的。"
    },
    hidden_ignore: {
      title: "隐藏结局A：完全无视旁白",
      kind: "隐藏结局",
      music: "hidden",
      text: "你连续违抗，直到旁白的推荐变成背景噪音。白房间吞下最后一句指令，留给你一扇没有标签的门。你没有赢过旁白，你只是让它失去了观众。"
    },
    hidden_obey: {
      title: "隐藏结局B：完全听从旁白",
      kind: "隐藏结局",
      music: "hidden",
      text: "你一路听从，甚至听从了那些明显像陷阱的温柔建议。旁白满意地接管了选择权，并宣布你获得最高荣誉：无需再选择。流程图为你关上了所有门。"
    }
  };

  const narratorBank = {
    obey: [
      "不错，这次终于动脑子了。虽然严格说来，是借用了我的。",
      "你听了我的建议。流程图露出一种被尊重的直线。",
      "很好。请记住这种感觉，它叫少走弯路。",
      "服从不一定优雅，但刚才这一小步还算合拍。",
      "你做出了正确选择。别激动，正确主要是因为我。"
    ],
    defy: [
      "你又选了我不推荐的门。叛逆这件事被你做得很节能。",
      "当然，你要反着来。流程图已经开始翻白眼。",
      "你是不是故意跟我作对？我问得很克制，真的。",
      "很好，偏航。请为即将出现的后果系好安全带。",
      "不听劝也是一种玩法，只是它经常收费。"
    ],
    neutral: [
      "这个选择不算聪明，也不算灾难，像一杯温水。",
      "路线继续移动。故事假装知道自己要去哪。",
      "我会记录这个选择，主要为了以后显得我早有预料。",
      "你通过了一扇门。门对此没有发表意见，素质不错。",
      "流程图轻微调整了表情，幅度不大，伤害不高。"
    ],
    lowPatience: [
      "你的耐心值正在下沉。别担心，它沉得很有节奏。",
      "再这样下去，理智会先于你抵达结局。",
      "耐心警报响了。它比你更早发现问题。",
      "你离崩溃只差几次“我偏要”。",
      "系统建议你深呼吸，旁白建议你听话。"
    ],
    highAnger: [
      "我现在非常平静。注意，平静这个词在这里是威胁性的。",
      "你的路线正在挑战我的职业尊严，而我的职业尊严并不宽敞。",
      "我看见你下一步还想乱选。别问我怎么知道，我是旁白。",
      "你已经卡在我的耐心边缘上跳踢踏舞了。",
      "请继续，我正好需要一个失败案例。"
    ],
    highControl: [
      "你越来越懂得配合了。真好，选择权终于开始回到合适的人手里。",
      "控制感正在恢复。流程图喜欢这样，我也喜欢。",
      "你会发现，听我说完是通往安宁的捷径。",
      "放心，我会替你把自由打包得很整齐。",
      "你看，少反抗之后，空气都变得像说明书。"
    ],
    unlockDefy: [
      "连续三次不听建议。很好，一条没有标签的路线醒了。",
      "隐藏路线被你用反骨敲开了。它非常不推荐，所以你大概会喜欢。",
      "系统记录：玩家持续违抗旁白。系统回应：那就让他看看白房间。"
    ],
    unlockObey: [
      "连续听从。美妙。某扇金边门正在为你整理交接文件。",
      "你服从得非常稳定，稳定到系统开始怀疑你是否还需要选择。",
      "隐藏路线开启：完全听从。放心，我会替你决定剩下的事。"
    ],
    achievements: [
      "成就解锁。别太骄傲，成就系统鼓励所有移动物体。",
      "你获得一个成就。它很小，但比刚才的选择更有结构。",
      "系统给你发了徽章，旁白给你发了一个意味深长的停顿。"
    ],
    glitch: [
      "界面刚才抖了一下。不是错误，是气氛。",
      "假弹窗出现。放心，它和你的选择一样，主要是表演。",
      "存档没有坏。只是它看过你的路线后需要一点戏剧空间。",
      "按钮挪动了一下。它说自己只是想离你的手远点。",
      "文字闪烁。不要怪文字，它也听见了刚才的决定。"
    ]
  };

  const achievements = [
    { id: "first_choice", title: "第一次开门", description: "做出第一个选择。" },
    { id: "three_defy", title: "三连违抗", description: "连续三次选择旁白不推荐的门。" },
    { id: "five_obey", title: "模范听众", description: "连续五次选择旁白推荐的门。" },
    { id: "core_seen", title: "看见配电箱", description: "抵达系统核心。" },
    { id: "mocked_ten", title: "被讲解员盯上", description: "累计触发十次嘲讽。" },
    { id: "first_ending", title: "至少结束过", description: "收集任意一个结局。" },
    { id: "four_endings", title: "多线玩家", description: "收集四个结局。" },
    { id: "all_endings", title: "全结局观察员", description: "收集全部八个结局。" }
  ];

  window.GAME_DATA = {
    version: "1.0.0",
    startingRoom: "start",
    rooms,
    roomMap: Object.fromEntries(rooms.map((room) => [room.id, room])),
    endings,
    narratorBank,
    achievements
  };
})();
