/**
 * Created by zhangmiao on 2018/3/18.
 */

module.exports = {
	  "nested": {
		"com": {
		  "nested": {
			"mds": {
			  "nested": {
				"chat": {
				  "nested": {
					"ChatMsg": {
					  "fields": {
						"mid": {
						  "type": "int64",
						  "id": 1
						},
						"uid": {
						  "type": "string",
						  "id": 2
						},
						"type": {
						  "type": "ContentType",
						  "id": 3
						},
						"text": {
						  "type": "string",
						  "id": 4
						},
						"attach": {
						  "type": "string",
						  "id": 5
						},
						"medialen": {
						  "type": "string",
						  "id": 6
						},
						"sender": {
						  "type": "string",
						  "id": 7
						},
						"time": {
						  "type": "int64",
						  "id": 8
						},
						"sessionId": {
						  "type": "string",
						  "id": 9
						},
						"thumbnail": {
						  "type": "string",
						  "id": 10
						},
						"redpackId": {
						  "type": "string",
						  "id": 11
						},
						"goodsId": {
						  "type": "string",
						  "id": 12
						},
						"extend": {
						  "type": "string",
						  "id": 13
						},
						"tag": {
						  "type": "string",
						  "id": 14
						},
						"notifyType": {
						  "type": "string",
						  "id": 15
						}
					  },
					  "nested": {
						"ContentType": {
						  "values": {
							"TEXT": 0,
							"IMG": 1,
							"SOUND": 2,
							"VIDEO": 3,
							"REDPACK": 4,
							"GOODS": 5,
							"PUSH": 6,
							"BROADCAST": 7,
							"LINK": 8,
							"SYSMSG": 9,
							"REFERRAL": 10,
							"RESERVE_1": 11,
							"RESERVE_2": 12,
							"RESERVE_3": 13,
							"RESERVE_4": 14,
							"RESERVE_5": 15,
							"RESERVE_6": 16,
							"RESERVE_7": 17,
							"RESERVE_8": 18,
							"RESERVE_9": 19,
							"RESERVE_10": 20
						  }
						}
					  }
					},
					"Ack": {
					  "fields": {
						"mid": {
						  "type": "int64",
						  "id": 1
						},
						"uid": {
						  "type": "string",
						  "id": 2
						},
						"time": {
						  "type": "int64",
						  "id": 3
						},
						"sessionId": {
						  "type": "string",
						  "id": 4
						}
					  }
					},
					"ChatMsgList": {
					  "fields": {
						"uid": {
						  "type": "string",
						  "id": 1
						},
						"msgs": {
						  "rule": "repeated",
						  "type": "ChatMsg",
						  "id": 2
						},
						"sessionId": {
						  "type": "string",
						  "id": 3
						},
						"mid": {
						  "type": "int64",
						  "id": 4
						}
					  }
					},
					"QueryMsg": {
					  "fields": {
						"uid": {
						  "type": "string",
						  "id": 1
						},
						"mid": {
						  "type": "int64",
						  "id": 2
						},
						"sessionId": {
						  "type": "string",
						  "id": 3
						}
					  }
					},
					"RefreshApply": {
					  "fields": {
						"uid": {
						  "type": "string",
						  "id": 1
						},
						"fid": {
						  "type": "string",
						  "id": 2
						}
					  }
					},
					"RefreshContact": {
					  "fields": {
						"uid": {
						  "type": "string",
						  "id": 1
						},
						"fid": {
						  "type": "string",
						  "id": 2
						}
					  }
					},
					"GroupRemove": {
					  "fields": {
						"uid": {
						  "type": "string",
						  "id": 1
						},
						"sessionId": {
						  "type": "string",
						  "id": 2
						}
					  }
					}
				  }
				}
			  }
			}
		  }
		}
	  }

}
