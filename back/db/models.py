from .database import Base

User = Base.classes.tb_user
Farm = Base.classes.tb_farm
Pen = Base.classes.tb_pen
Cow = Base.classes.tb_cow
Camera = Base.classes.tb_camera
Mounting = Base.classes.tb_mounting
Message = Base.classes.tb_message
VapidKey = Base.classes.tb_push_vapid_key
PushSubscription = Base.classes.push_subscriptions
Event = Base.classes.tb_event